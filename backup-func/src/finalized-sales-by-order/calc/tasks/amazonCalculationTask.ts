import { CalculationTask } from '../CalculationTaskRunner';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { AmazonRelations } from '../../models/relations';
import { PointRate } from '../../../amazon/constants';
import { CalculationLog } from '../CalculationLog';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { SalesChannel } from '../../../helper/types';
import { ICostMaster } from '../../../cost-master/models/schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：演算タスク
 * @param targetDate 
 * @returns 
 */
//-------------------------------------------------------------------------------
export const amazonCalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedShippingResult: IFinalizedShipping[], costPriceMaster: ICostMaster[]) => {

  //==================================
  //
  // 売上確定データの取得
  //
  //==================================

  // Amazonのrelationsを生成
  const relations = await AmazonRelations.init();
  // const kpis = await relations.kpi.getAll();
  //const adCampaign = await relations.adCampaign.getAll();
  //const adOthers = await relations.adOthers.getAll();

  const amazonList = finalizedShippingResult.filter((i) => i.salesChannel === SalesChannel.Amazon);

  // 演算処理の実行
  // 返却値に演算結果を取得する
  const result = await Promise.allSettled(

    // 売上確定データの数だけ繰り返して演算処理を行う
    // 返却値に演算結果の詳細を取得
    amazonList.map(async (fs): Promise<IFinalizedSalesByOrder & { log: CalculationLog }> => {

      //==================================
      //
      // 演算結果格納用の宣言
      //
      //==================================

      const calc: {
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
        click: number | undefined;
        amazonCvr: number | undefined;
        cpc: number | undefined;
        cpa: number | undefined;
        ctr: number | undefined;
        roas: number | undefined;
        sales: number | undefined;
        conversion: number | undefined;
      } = {
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
        click: undefined,
        amazonCvr: undefined,
        cpc: undefined,
        ctr: undefined,
        roas: undefined,
        cpa: undefined,
        sales: undefined,
        conversion: undefined,
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
      if (typeof division === 'undefined') {
        log.error('division not found');
      }
      else {
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
      if (typeof salesChannel === 'undefined') {
        log.error('salesChannel not found');
      }
      else {
        calc.salesChannelCode = salesChannel?.salesChannelCode;
      }

      //==================================
      //
      // 演算処理：原価
      //
      //==================================

      const leoId = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.leoId || "";
      const inventoryUnitPrice = costPriceMaster.find((i) => i.leoId === leoId)?.costPrice || 0;

      // 演算結果にデータ設定
      calc.inventoryUnitPrice = inventoryUnitPrice;

      // 原価 = 在庫単価 * 販売数量
      const inventoryTotalPrice = inventoryUnitPrice * fs.quantity;
      calc.inventoryTotalPrice = inventoryTotalPrice;

      try {
        //==================================
        //
        // 演算処理：販売促進費
        //
        //==================================

        // 販売促進費 = 手数料　+　クーポン利用額　+　ポイント付与分　
        const promotionFee = fs.commissionFee + fs.promotionDiscount + (fs.totalPrice * PointRate);
        calc.promotionFee = promotionFee;
        //==================================
        //
        // 演算処理：広告宣伝費
        //
        //==================================

        /*const adSource = {
          adCampaign,
          adOthers
        };

        // 広告宣伝費
        const advertisingFee = (
          calcAdvertisingFee(ordersResult, fs, adSource)
        ).amount;*/

        // 演算結果にデータ設定
        calc.advertisingFee = 0;
      }
      catch (e) {
        // getAllでエラーが起きても処理続行
        // orders[0]の取得失敗しても処理続行
        log.error(e as string);
      }



      //==================================
      //
      // amazon-ads-kpi
      //
      //==================================

      try {
        const kpi = await relations.kpi.getByCondition({ inventoryId: inventoryId, finalizedAt: fs.finalizedAt });
        if (!kpi) {
          throw new Error('kpi not found');
        }

        calc.click = kpi.click;
        calc.amazonCvr = kpi.cvr;
        calc.cpc = kpi.cpc;
        calc.ctr = kpi.ctr;
        calc.roas = kpi.roas;
        calc.sales = kpi.sales;
        calc.conversion = kpi.conversion;
        calc.cpa = kpi.cpa;

      } catch (e) {
        // getAllでエラーが起きても処理続行
        // orders[0]の取得失敗しても処理続行
        log.error(e as string);
      }

      //==================================
      //
      // 成功メッセージ
      //
      //==================================

      // エラーが0件だったら成功メッセージをストックする
      if (log.errorCount() === 0) {
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
        costPrice: calc.inventoryTotalPrice || 0,
        shippingFee: fs.shippingFee,
        commissionFee: fs.commissionFee,
        advertisingFee: calc.advertisingFee || 0,
        promotionFee: calc.promotionFee || 0,
        click: calc.click || 0,
        amazonCvr: calc.amazonCvr || 0,
        cpc: calc.cpc || 0,
        ctr: calc.ctr || 0,
        cpa: calc.cpa || 0,
        roas: calc.roas || 0,
        sales: calc.sales || 0,
        conversion: calc.conversion || 0,
        createdAt: fs.createdAt,
        updatedAt: fs.updatedAt,
        finalizedAt: fs.finalizedAt,
        log,
      };
    })
  );

  // 演算結果を返却
  return result;
};
