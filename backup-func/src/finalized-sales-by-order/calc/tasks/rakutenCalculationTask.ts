import { SalesChannel } from '../../../helper/types';
import { CommissionFeeRate } from '../../../rakuten/constants';
import { RakutenRelations } from '../../models/relations';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { CalculationTask } from '../CalculationTaskRunner';
import { calcPromotionFee } from '../../../rakuten/promotion-fee/calc';
import { calcAdvertisingFee } from '../../../rakuten/advertising-fee/calc';
import { CalculationLog } from '../CalculationLog';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { ICostMaster } from '../../../cost-master/models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：演算タスク
 * @param targetDate 
 * @returns 
 */
//-------------------------------------------------------------------------------
export const rakutenCalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedShippingResult: IFinalizedShipping[], costMaster: ICostMaster[]) => {

  //==================================
  //
  // 売上確定データの取得
  //
  //==================================

  // relationsを生成
  const relations = await RakutenRelations.init();

  // 売上確定データを生成
  //  - 売上確定データの「出荷確定日、販売チャンネル」が一致するデータを取得する
  //  - 出荷確定日はUnixTimeに変換して保存されているので検索に引っかかるようにここでも行う
  //  - 販売チャンネルはConverterで用途に合わせて設定しているのでそちらを確認する
  // const orders = await relations.order.getAll();

  const adCa = await relations.adCa.getAll();
  const adRpp = await relations.adRpp.getAll();
  const adTda = await relations.adTda.getAll();
  const campaign = await relations.campaign.getAll();
  const adOthers = await relations.adOthers.getAll();

  const rakutenList = finalizedShippingResult.filter((i) => i.salesChannel === SalesChannel.Rakuten);

  // 演算処理の実行
  // 返却値に演算結果を取得する
  const result = await Promise.allSettled(

    // 売上確定データの数だけ繰り返して演算処理を行う
    // 返却値に演算結果の詳細を取得
    rakutenList.map(async (fs): Promise<IFinalizedSalesByOrder & { log: CalculationLog }> => {

        //==================================
        //
        // 演算結果格納用の宣言
        //
        //==================================
        
        const calc: {
          productCode: string | undefined;
          divisionCode: string | undefined;
          divisionName: string | undefined;
          salesChannelCode: string | undefined;
          salesChannel: string | undefined;
          inventoryUnitPrice: number | undefined;
          inventoryTotalPrice: number | undefined;
          advertisingFee: number | undefined;
          promotionFee: number | undefined;
          commissionFee: number | undefined;
          salesAmount: number | undefined;
        } = {
          productCode: undefined,
          divisionCode: undefined,
          divisionName: undefined,
          salesChannelCode: undefined,
          salesChannel: undefined,
          inventoryUnitPrice: undefined,
          inventoryTotalPrice: undefined,
          advertisingFee: undefined,
          promotionFee: undefined,
          commissionFee: undefined,
          salesAmount: undefined,
        }

        // 演算結果にデータ設定
        calc.salesAmount = fs.totalPrice;

        //==================================
        //
        // ログ記録の作成
        //
        //==================================

        // ログ記録に設定する物
        //  - 在庫ID
        //  - 注文ID
        const inventoryId = fs.inventoryId;
        const orderId = fs.orderId;

        // ログ記録の生成
        const log = new CalculationLog(inventoryId, orderId);

        // データ照合により一致する物は取得する
        //  - ブランド変換マスタSS: ブランド名
        //  - 商品マスタSS: ブランド
        const division = relations.divisionCodeMaster.find(
            (d) => d.brandName === relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.brandName
        );

        // データが存在しなければ、エラーログとして記録する
        // データが存在すれば、演算結果にデータ設定
        if (typeof division === 'undefined') 
        {
          log.error('division not found');
        }
        else
        {
          calc.divisionCode = division?.divisionCode;
          calc.divisionName = division?.brandName;
        }

        // データ照合により一致する物は取得する
        //  - 販売マスタSS: 販売元名
        //  - 売上確定データCSV: 販売チャンネル
        const salesChannel = relations.salesChannelMaster.find(
          (c) => c.salesChannel === fs.salesChannel
        );

        // データが存在しなければ、エラーログとして記録する
        // データが存在すれば、演算結果にデータ設定
        if (typeof salesChannel === 'undefined') 
        {
          log.error('salesChannel not found');
        }
        else 
        {
          calc.salesChannelCode = salesChannel?.salesChannelCode;
          calc.salesChannel = salesChannel?.salesChannel;
        }

        //==================================
        //
        // 演算処理：原価
        //
        //==================================

        // 蔵奉行_在庫単価データ取得のtry-catch
        // エラーが起きても処理を継続する
        const leoId = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.leoId || "";
        const inventoryUnitPrice = costMaster.find((i) => i.leoId === leoId)?.costPrice || 0;   

        // 演算結果にデータ設定
        calc.inventoryUnitPrice = inventoryUnitPrice;
  
        // 原価 = 在庫単価 * 販売数量
        const inventoryTotalPrice = inventoryUnitPrice * fs.quantity;
        calc.inventoryTotalPrice = inventoryTotalPrice;

        //==================================
        //
        // 商品コードの割り出し
        //
        //==================================
        try 
        {
          // 注文データの取得
          // [ 引数 ]
          //  - 売上確定データの注文ID
          const ordersResult = await relations.order.getAll({ orderId: fs.orderId });
          // const ordersResult = orders.filter((i) => i.orderId === fs.orderId);

          /**
           * 商品コードの探索
           * 1. 商品マスタに登録されていればそれを使用する
           * 2. 注文が単一の場合、注文に紐づく商品コードを使用する(同時に商品マスタを更新する)
           * 3. 1,2で特定できない場合は出荷確定データと注文データの注文数量と単価が一致するものを使用する
           */
          const isSingleOrder = ordersResult.length === 1;
          const order = isSingleOrder
            ? ordersResult[0]
            : ordersResult.find(
                (order) =>
                  order.quantity === fs.quantity &&
                  order.productUnitPrice === fs.unitPrice
              );

          // 商品コードを設定
          calc.productCode = order?.productControlCode || '';

          //==================================
          //
          // 演算処理：広告宣伝費
          //
          //==================================

          const adSource = {
            adCa,
            adRpp,
            adTda,
            campaign,
            adOthers
          };

          /**
           * 広告宣伝費
           */
          const adCalcResult = await calcAdvertisingFee(
            ordersResult,
            fs,
            calc.productCode,
            adSource
          );

          // 演算結果にデータ設定
          calc.advertisingFee  = adCalcResult.amount;

          //==================================
          //
          // 演算処理：販売促進費
          //
          //==================================

          /**
           * 販売促進費
           */
          const promoCalcResult = calcPromotionFee(ordersResult, fs);
          calc.promotionFee = promoCalcResult.amount;
        }
        catch (error) {
            log.error(error as string);
        }

        //==================================
        //
        // 演算処理：手数料
        //
        //==================================

        // 手数料 = 売上 * 手数料率
        const commissionFee = fs.commissionFee + fs.totalPrice * CommissionFeeRate;
        calc.commissionFee = commissionFee;

        //==================================
        //
        // 成功メッセージ
        //
        //==================================

        // エラーが0件だったら成功メッセージをストックする
        if( log.errorCount() === 0 ){
          log.message('calculation success');
        }


        // 演算結果の詳細を返却
        return {
          ...fs,
          leoId,
          costPrice: calc.inventoryTotalPrice,
          divisionCode: calc.divisionCode || '',
          divisionName: calc.divisionName || '',
          salesChannelCode: calc.salesChannelCode || '',
          salesChannel: calc.salesChannel || '',
          advertisingFee: calc.advertisingFee || 0,
          promotionFee: calc.promotionFee || 0,
          commissionFee: calc.commissionFee || 0,
          salesAmount: calc.salesAmount || 0,
          log,
        };
      }
    )
  );

  // 演算結果を返却
  return result;
};
