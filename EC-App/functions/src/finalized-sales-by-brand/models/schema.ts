import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * インターフェイス：ブランド別販売実績ドキュメント
 */
//-------------------------------------------------------------------------------
export interface IFinalizedSalesByBrandDocument extends DocumentData 
{
    quantity: number; // 販売数量
    salesAmount: number; // 売上
    inventoryTotalPrice: number; // 原価
    shippingFee: number; // 送料
    commissionFee: number; // 手数料
    advertisingFeeTotal: number; // 広告費
    promotionFee: number; // 販管費
    profitAmount: number; // 一次利益
    profitAmountRate: number; // 一次利益率
    advertisingFeeTotalRate: number; // 広告費率
    averageUserUnitPrice: number; // 平均顧客単価
    averageUserProfitAmount: number; // 平均顧客一次利益
    averageGetQuantity: number; // 平均購入個数
    click: number; // クリック数
    conversion: number; // 広告経由CV
    amazonCvr: number; //広告経由CVR
    cpc: number; // CPC
    ctr: number; // CPA
    roas: number; // ROAS
    sales: number; // 広告経由売上
}

//-------------------------------------------------------------------------------
/**
 * インターフェイス：ブランド別販売実績
 */
//-------------------------------------------------------------------------------
export interface IFinalizedSalesByBrand 
{
    quantity: number; // 販売数量
    salesAmount: number; // 売上
    inventoryTotalPrice: number; // 原価
    shippingFee: number; // 送料
    commissionFee: number; // 手数料
    advertisingFeeTotal: number; // 広告費
    promotionFee: number; // 販管費
    profitAmount: number; // 一次利益
    profitAmountRate: number; // 一次利益率
    advertisingFeeTotalRate: number; // 広告費率
    averageUserUnitPrice: number; // 平均顧客単価
    averageUserProfitAmount: number; // 平均顧客一次利益
    averageGetQuantity: number; // 平均購入個数
    click: number; // クリック数
    conversion: number; // 広告経由CV
    amazonCvr: number; //広告経由CVR
    cpc: number; // CPC
    ctr: number; // CPA
    roas: number; // ROAS
    sales: number; // 広告経由売上
}

//-------------------------------------------------------------------------------
/**
 * インターフェイス：ブランド別販売実績シートレコード
 */
//-------------------------------------------------------------------------------
export interface IFinalizedSalesByBrandSheetRow 
{
    
}