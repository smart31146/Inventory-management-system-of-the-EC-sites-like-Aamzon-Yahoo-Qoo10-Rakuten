import { subMonths } from 'date-fns';
import { SalesChannel } from '../../../helper/types';
import { CalculationTask } from '../CalculationTaskRunner';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { YahooRelations } from '../../models/relations';
import { calcCommissionFee } from '../../../yahoo/claims/calc';
import { calcPromotionFee } from '../../../yahoo/promotion-fee/calc';
import { calcAdvertisingFee } from '../../../yahoo/advertising-fee/calc';
import { CalculationLog } from '../CalculationLog';
import { IYahooOrder } from '../../../yahoo/order/models/schema';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { ICostMaster } from '../../../cost-master/models/schema';
import { FinalizedShippingRepository } from '../../../finalized-shipping/models/repository';
import { CostMasterRepository } from '../../../cost-master/models/repository';

//-------------------------------------------------------------------------------
/**
 * Yahoo：演算タスク
 * @param targetDate 
 * @returns 
 */
//-------------------------------------------------------------------------------
export const yahooCalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedAt: Date) => {
  
  //==================================
  //
  // 売上確定データの取得
  //
  //==================================

  // relationsを生成
  const relations = await YahooRelations.init();

  // 売上確定データを生成
  //  - 売上確定データの「出荷確定日、販売チャンネル」が一致するデータを取得する
  //  - 出荷確定日はUnixTimeに変換して保存されているので検索に引っかかるようにここでも行う
  //  - 販売チャンネルはConverterで用途に合わせて設定しているのでそちらを確認する

  /*const orders = await relations.order.getAll();
  const campaignCapitalRates = await relations.campaignCapitalRate.getAll();
  const claims = await relations.claims.getAll();

  const itemMatch = await relations.itemMatch.getAll();
  const makerItemMatch = await relations.makerItemMatch.getAll();
  const campaign = await relations.campaign.getAll();
  const adOthers = await relations.adOthers.getAll();*/

  const finalizedShipping = new FinalizedShippingRepository();
  const costMaster = new CostMasterRepository();

  const yahooList = await finalizedShipping.getAll({
    finalizedAt: finalizedAt.getTime(),
    salesChannel: SalesChannel.Yahoo,
  });

  // 演算処理の実行
  // 返却値に演算結果を取得する
  const result = await Promise.allSettled(

    // 売上確定データの数だけ繰り返して演算処理を行う
    // 返却値に演算結果の詳細を取得
    yahooList.map(async (fs): Promise<IFinalizedSalesByOrder & { log: CalculationLog }> => {
      
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

      //==================================
      //
      // データ照合
      //
      //==================================

      // データ照合により一致する物は取得する
      //  - ブランド変換マスタSS: ブランド名
      //  - 商品マスタSS: ブランド
      const brandName = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.brandName;
      const division = relations.divisionCodeMaster.find(
        (d) => d.brandName === brandName
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
      }

      //==================================
      //
      // 演算処理：原価
      //
      //==================================

      // 蔵奉行_在庫単価データ取得のtry-catch
      // エラーが起きても処理を継続する


      // 蔵奉行_在庫単価データCSVのデータから指定した在庫単価を取得
      // [ 引数 ]
      //  - 売上確定データの在庫ID
      //  - 先月の時間
      
      const leoId = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.leoId || "";
      const cost = await costMaster.getOne({ leoId });
      const inventoryUnitPrice = cost?.costPrice || 0;
      
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
      
     /* try 
      {
        
          //Yahooは注文IDがユニークではないため、LineItemという単位で集計する
         // 注文IDは同じであっても、商品が異なる場合がある
         // finalizedShippingの集計単位は注文ID+在庫ID
        // LineItemの集計単位は注文ID+商品名
        
        const ordersResult = orders.filter((i) => i.orderId === fs.orderId);
        const lineIds = new Set(ordersResult.map((item) => item.lineId));
        const lineItems: IYahooOrder[] = [];
        lineIds.forEach((lineId) => {
          const item = ordersResult.find((i) => i.lineId === lineId);

        //   // データの取得判定
        //   if (item) 
        //   {
        //     // 取得データが存在する場合
        //     // 返却値に取得データを格納
        //     lineItems.push(item);
        //   }
        // });
        const lineTotalQuanity = lineItems.reduce(
          (acc, cur) => acc + cur.quantity,
          0
        );

       //
       // 商品コードの探索
        // 商品マスタに登録されていればそれを使用する
        // 注文が単一の場合、注文に紐づく商品コードを使用する(同時に商品マスタを更新する) // TODO: 商品マスタの更新が未実装のため実装する
       // 1,2で特定できない場合は出荷確定データと注文データの注文数量と単価が一致するものを使用する
        //
        const productCode = lineItems.length === 1
            ? lineItems[0].productCode
            : lineItems.find(
                (order) =>
                  order.quantity === fs.quantity &&
                  order.productUnitPrice === fs.unitPrice
              )?.productCode || '';

        // 商品コードを設定
        calc.productCode = productCode;

        //==================================
        //
        // 演算処理：広告宣伝費
        //
        //==================================

        try {
          const adSource = {
            itemMatch,
            makerItemMatch,
            campaign,
            adOthers,
          };
          const advertisingFee = calcAdvertisingFee(
            lineItems,
            fs,
            productCode,
            adSource
          );
          // 演算結果にデータ設定
          calc.advertisingFee = advertisingFee.amount;
        } catch (e) {
          log.error(e as string);
        }

        //==================================
        //
        // 演算処理：販売促進費
        //
        //==================================

        // 販売促進費の演算処理のtry-catch
        // エラーが起きても処理を継続する
        try
        {
          const campaignCapitalRate = campaignCapitalRates.find((i) => i.date === lineItems[0].orderedAt);
          if (!campaignCapitalRate) {
            throw new Error('campaignCapitalRate not found');
          }

          const promotionFee = calcPromotionFee(
            lineItems,
            fs,
            campaignCapitalRate
          );

          // 演算結果にデータ設定
          calc.promotionFee = promotionFee.amount;
        }
        catch(e)
        {
          // getOneでエラーが起きても処理継続
          log.error(e as string);
        }

        //==================================
        //
        // 演算処理：手数料
        //
        //==================================

        try {
          
          // 手数料 = Yahoo!手数料 + 決済手数料 + PRオプション利用料 + プロモーションパッケージ利用料
          //- Yahoo!手数料 = ポイント原資 + キャンペーン原資
          //- 決済手数料 = PRオプション利用料 | ポイント原資 | キャンペーン原資 | プロモーションパッケージ利用料 | Yahoo!ショッピング　トリプル　300MBプラン 以外の合計
          //
          const claimsResult = claims.filter((i) => i.orderId === fs.orderId);
          const commissionFee = calcCommissionFee(
            claimsResult,
            fs.quantity,
            lineTotalQuanity
          );

          // 演算結果にデータ設定
          calc.commissionFee = commissionFee;
        } catch (e) {
          log.error(e as string);
        }

      }
      catch(e) {
        // getByOrderIdでエラーが起きても処理継続
        log.error(e as string);
      }*/
    
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
        inventoryId: fs.inventoryId,
        leoId,
        orderId: fs.orderId,
        productName: fs.productName,
        salesChannel: fs.salesChannel,
        salesChannelCode: calc.salesChannelCode || '',
        divisionCode: calc.divisionCode || '',
        divisionName: calc.divisionName || '',
        unitPrice: fs.unitPrice,
        quantity: fs.quantity,
        salesAmount: calc.salesAmount || 0,
        costPrice: calc.inventoryTotalPrice,
        click: 0,
        amazonCvr:  0,
        cpc:  0,
        ctr: 0,
        cpa: 0,
        roas:  0,
        sales:  0,
        conversion:  0,
        createdAt: fs.createdAt,
        updatedAt: fs.updatedAt,
        finalizedAt: fs.finalizedAt,
        shippingFee: fs.shippingFee,
        commissionFee: fs.commissionFee,
        advertisingFee: 0,
        promotionFee: 0,
        log,
      };
    })
  );

  // 演算結果を返却
  return result;
};
