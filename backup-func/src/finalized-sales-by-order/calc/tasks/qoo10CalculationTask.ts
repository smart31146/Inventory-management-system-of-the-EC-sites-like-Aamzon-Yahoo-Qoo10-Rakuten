import { CalculationTask } from '../CalculationTaskRunner';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { Qoo10Relations } from '../../models/relations';
import { SalesChannel } from '../../../helper/types';
import { CommissionFeeRate, PointRate } from '../../../qoo10/constants';
import { CalculationLog } from '../CalculationLog';
import { calcAdvertisingFee } from '../../../qoo10/advertising-fee/calc';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { ICostMaster } from '../../../cost-master/models/schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：演算タスク
 * @param targetDate 売上確定データで使用する日付（売上確定データの「出荷確定日」が一致するデータが使われる）
 * @returns 演算結果
 */
//-------------------------------------------------------------------------------
export const qoo10CalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedShippingResult: IFinalizedShipping[], costMaster: ICostMaster[]) => {

  //==================================
  //
  // 売上確定データの取得
  //
  //==================================

  // relationsを生成
  const relations = await Qoo10Relations.init();

  // const orders = await relations.order.getAll();
  // const promotionSettlements = await relations.promotionSettlement.getAll();
  // const cartDiscounts = await relations.cartDiscount.getAll();

  const adSmart = await relations.adSmart.getAll();
  const adOthers = await relations.adOthers.getAll();

  const qoo10List = finalizedShippingResult.filter((i) => i.salesChannel === SalesChannel.Qoo10);

  // 演算処理の実行
  // 返却値に演算結果を取得する
  const result = await Promise.allSettled(

    // 売上確定データの数だけ繰り返して演算処理を行う
    // 返却値に演算結果の詳細を取得
    qoo10List.map(async (fs): Promise<IFinalizedSalesByOrder & { log: CalculationLog }> => {
      
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

      // エラーログ記録に設定する値を取得
      //  - 売上確定データの在庫ID
      //  - 売上確定データの注文ID
      const inventoryId = fs.inventoryId;
      const orderId = fs.orderId;

      // エラーログ記録を作成
      const log = new CalculationLog(inventoryId, orderId);

      //==================================
      //
      // データ照合
      //
      //==================================

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

      // 蔵奉行_在庫単価データCSVのデータから指定した在庫単価を取得
      // [ 引数 ]
      //  - 売上確定データの在庫ID
      //  - 先月の時間
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
        const ordersResult = await relations.order.getByOrderId({ orderId: fs.orderId });
        // const ordersResult = orders.filter((i) => i.orderId === fs.orderId);

        /**
         * 商品コードの探索
         * 1. 商品マスタに登録されていればそれを使用する
         * 2. 注文が単一の場合、注文に紐づく商品コードを使用する(同時に商品マスタを更新する) // TODO: 商品マスタの更新が未実装のため実装する
         * 3. 1,2で特定できない場合は出荷確定データと注文データの注文数量と単価が一致するものを使用する
         */
        const productCode = ordersResult?.length === 1
            ? ordersResult[0].productCode
            : ordersResult?.find(
                (order) =>
                  order.orderId === fs.orderId
              )?.productCode || '';

        // 演算結果にデータ設定
        calc.productCode = productCode;

        //==================================
        //
        // 演算処理：広告宣伝費
        //
        //==================================

        /**
         * 広告費伝票
         *  - 注文データ
         *  - 売上確定データ
         *  - 商品コード
         */
        const adSource = {
          adSmart,
          adOthers
        };

        const advertisingFee = calcAdvertisingFee(
          ordersResult,
          fs,
          productCode,
          adSource
        );

        // 演算結果にデータ設定
        calc.advertisingFee = advertisingFee.amount;


        // ポイント負担分(売上 * ポイント倍率)
        const pointAmount = fs.totalPrice * PointRate;

        // プロモーション精算内訳データの取得
        // [ 引数 ]
        //  - 売上確定データの在庫ID
        const promotionSettlement = await relations.promotionSettlement.getOne({ orderId: fs.orderId });
        // const promotionSettlement = promotionSettlements.find((i) => i.orderId === fs.orderId);
        if (!promotionSettlement) {
            throw new Error('promotionSettlement not found');
        }

        // カート割引データの取得
        // [ 引数 ]
        //  - 売上確定データの在庫ID
        const cartDiscount = await relations.cartDiscount.getOne({ orderId: fs.orderId });
        // const cartDiscount = cartDiscounts.find((i) => i.orderId === fs.orderId);
        if (!cartDiscount) {
            throw new Error('cartDiscount not found');
        }

        // 販売促進費 = 販売店負担割引額 + メガ割り店舗負担分 + ポイント負担分 + SHOPクーポン利用額
        const promotionFee =
        ordersResult[0].storeDiscountAmount +
        promotionSettlement.megawariCouponAmount +
        pointAmount +
        cartDiscount.amount / 1.1;

        // 演算結果にデータ設定
        calc.promotionFee = promotionFee;

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
      // 演算結果にデータ設定
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
    })
  );

  // 演算結果を返却
  return result;
};
