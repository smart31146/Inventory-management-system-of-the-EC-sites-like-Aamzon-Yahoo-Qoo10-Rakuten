import { SalesChannel } from '../../../helper/types';
import { RakutenRelations } from '../../models/relations';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { CalculationTask } from '../CalculationTaskRunner';
import { CalculationLog } from '../CalculationLog';
import { CostMasterRepository } from '../../../cost-master/models/repository';
import { FinalizedShippingRepository } from '../../../finalized-shipping/models/repository';

//-------------------------------------------------------------------------------
/**
 * 楽天：演算タスク
 * @param targetDate 
 * @returns 
 */
//-------------------------------------------------------------------------------
export const rakutenCalculationTask: CalculationTask<IFinalizedSalesByOrder> = async (finalizedAt: Date) => {

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

  /*
  const adCa = await relations.adCa.getAll();
  const adRpp = await relations.adRpp.getAll();
  const adTda = await relations.adTda.getAll();
  const campaign = await relations.campaign.getAll();
  const adOthers = await relations.adOthers.getAll();*/

  const finalizedShipping = new FinalizedShippingRepository();
  const costMaster = new CostMasterRepository();

  const rakutenList = await finalizedShipping.getAll({
    finalizedAt: finalizedAt.getTime(),
    salesChannel: SalesChannel.Rakuten,
  });


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

        // 蔵奉行_在庫単価データ取得のtry-catch
        // エラーが起きても処理を継続する
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

          
           //広告宣伝費
           
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

          
           //販売促進費
           
          const promoCalcResult = calcPromotionFee(ordersResult, fs);
          calc.promotionFee = promoCalcResult.amount;
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
          promotionFee: fs.promotionDiscount,
          log,
        };
      }
    )
  );

  // 演算結果を返却
  return result;
};
