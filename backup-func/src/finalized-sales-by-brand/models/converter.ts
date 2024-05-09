import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
  } from 'firebase-admin/firestore';
  
 import {
   IFinalizedSalesByBrand,
   IFinalizedSalesByBrandDocument,
 } from './schema';

//-------------------------------------------------------------------------------
/**
 * ブランド別販売実績のコンバータ
 */
//-------------------------------------------------------------------------------
export class FinalizedSalesByBrandConverter implements FirestoreDataConverter<IFinalizedSalesByBrand>
{
    //-------------------------------------------------------------------------------
    /**
     * Firestoreへのデータ設定
     * @param entity 
     */
    //-------------------------------------------------------------------------------
    toFirestore( entity: IFinalizedSalesByBrand ): IFinalizedSalesByBrandDocument 
    {
        return {
            quantity: entity.quantity, // 販売数量
            salesAmount: entity.salesAmount, // 売上
            inventoryTotalPrice: entity.inventoryTotalPrice, // 原価
            shippingFee: entity.shippingFee, // 送料
            commissionFee: entity.commissionFee, // 手数料
            advertisingFeeTotal: entity.advertisingFeeTotal, // 広告費
            profitAmount: entity.profitAmount, // 一次利益
            profitAmountRate: entity.profitAmountRate, // 一次利益率
            advertisingFeeTotalRate: entity.advertisingFeeTotalRate, // 広告費率
            promotionFee: entity.promotionFee, // 販管費
            averageUserUnitPrice: entity.averageUserUnitPrice, // 平均顧客単価
            averageUserProfitAmount: entity.averageUserProfitAmount, // 平均顧客一次利益
            averageGetQuantity: entity.averageGetQuantity, // 平均購入個数
            click: entity.click, // クリック数
            conversion: entity.conversion, // 広告経由CV
            amazonCvr: entity.amazonCvr, //広告経由CVR
            cpc: entity.cpc, // CPC
            ctr: entity.ctr, // CPA
            roas: entity.roas, // ROAS
            sales: entity.sales, // 広告経由売上
        }
    }

    //-------------------------------------------------------------------------------
    /**
     * Firestoreのデータ取得
     * @param snapshot 
     */
    //-------------------------------------------------------------------------------
    fromFirestore( snapshot: QueryDocumentSnapshot<IFinalizedSalesByBrandDocument> ): IFinalizedSalesByBrand 
    {
        const data = snapshot.data();
        return {
            quantity: data.quantity,
            salesAmount: data.salesAmount, // 売上
            inventoryTotalPrice: data.inventoryTotalPrice, // 原価
            shippingFee: data.shippingFee, // 送料
            commissionFee: data.commissionFee, // 手数料
            advertisingFeeTotal: data.advertisingFeeTotal, // 広告費
            profitAmount: data.profitAmount, // 一次利益
            profitAmountRate: data.profitAmountRate, // 一次利益率
            advertisingFeeTotalRate: data.advertisingFeeTotalRate, // 広告費率
            promotionFee: data.promotionFee, // 販管費
            averageUserUnitPrice: data.averageUserUnitPrice, // 平均顧客単価
            averageUserProfitAmount: data.averageUserProfitAmount, // 平均顧客一次利益
            averageGetQuantity: data.averageGetQuantity, // 平均購入個数
            click: data.click, // クリック数
            conversion: data.conversion, // 広告経由CV
            amazonCvr: data.amazonCvr, //広告経由CVR
            cpc: data.cpc, // CPC
            ctr: data.ctr, // CPA
            roas: data.roas, // ROAS
            sales: data.sales, // 広告経由売上
        }
    }

    //-------------------------------------------------------------------------------
    /**
     * スプレッドシートからの取得
     * @param entity 
     * @returns 
     */
    //-------------------------------------------------------------------------------
    toSheetRow(entity: IFinalizedSalesByBrand): (string|number)[] 
    {
        return [
            entity.quantity, // 販売数量
            entity.salesAmount, // 売上
            entity.inventoryTotalPrice, // 原価
            entity.shippingFee, // 送料
            entity.commissionFee, // 手数料
            entity.advertisingFeeTotal, // 広告費
            entity.profitAmount, // 一次利益
            entity.profitAmountRate, // 一次利益率
            entity.advertisingFeeTotalRate, // 広告費率
            entity.promotionFee, // 販管費
            entity.averageUserUnitPrice, // 平均顧客単価
            entity.averageUserProfitAmount, // 平均顧客一次利益
            entity.averageGetQuantity, // 平均購入個数
            entity.click, // クリック数
            entity.conversion, // 広告経由CV
            entity.amazonCvr, //広告経由CVR
            entity.cpc, // CPC
            entity.ctr, // CPA
            entity.roas, // ROAS
            entity.sales, // 広告経由売上
        ]
    }
}