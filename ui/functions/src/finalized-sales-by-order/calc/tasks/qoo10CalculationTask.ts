import { CalculationTask } from '../CalculationTaskRunner';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { Qoo10Relations } from '../../models/relations';
import { SalesChannel } from '../../../helper/types';
import { CalculationLog } from '../CalculationLog';
import { CostMasterRepository } from '../../../cost-master/models/repository';
import { FinalizedShippingRepository } from '../../../finalized-shipping/models/repository';

//-------------------------------------------------------------------------------
/**
 * Qoo10：演算タスク
 * @param targetDate 売上確定データで使用する日付（売上確定データの「出荷確定日」が一致するデータが使われる）
 * @returns 演算結果
 */
//-------------------------------------------------------------------------------
export const qoo10CalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedAt: Date) => {

  //==================================
  //
  // 売上確定データの取得
  //
  //==================================

  // relationsを生成
  const relations = await Qoo10Relations.init();

  /*const orders = await relations.order.getAll();
  const promotionSettlements = await relations.promotionSettlement.getAll();
  const cartDiscounts = await relations.cartDiscount.getAll();

  const adSmart = await relations.adSmart.getAll();
  const adOthers = await relations.adOthers.getAll();*/

  
  const finalizedShipping = new FinalizedShippingRepository();
  const costMaster = new CostMasterRepository();

  const qoo10List = await finalizedShipping.getAll({
    finalizedAt: finalizedAt.getTime(),
    salesChannel: SalesChannel.Qoo10,
  });

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
      const brandName = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.brandName;
      const division = relations.divisionCodeMaster.find(
        (d) => d.brandName === brandName
      );

      // データが存在しなければ、エラーログとして記録する
      // データが存在すれば、演算結果にデータ設定
      if (typeof division === 'undefined') {
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

      /*try 
      {
        // 注文データの取得
        // [ 引数 ]
        //  - 売上確定データの注文ID
        const ordersResult = await relations.order.getByOrderId({ orderId: fs.orderId });
        // const ordersResult = orders.filter((i) => i.orderId === fs.orderId);

      
        const productCode = ordersResult.length === 1
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
        shippingFee: fs.shippingFee,
        commissionFee: fs.commissionFee,
        click: 0,
        amazonCvr: 0,
        cpc:  0,
        ctr: 0,
        cpa: 0,
        roas: 0,
        sales:  0,
        conversion:  0,
        createdAt: fs.createdAt,
        updatedAt: fs.updatedAt,
        finalizedAt: fs.finalizedAt,
        log,
        
        advertisingFee: calc.advertisingFee || 0,
        promotionFee: calc.promotionFee || 0,

      };
    })
  );

  // 演算結果を返却
  return result;
};
