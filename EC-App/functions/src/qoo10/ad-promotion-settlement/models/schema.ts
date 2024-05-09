import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Qoo10：プロモーション精算内訳ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdPromotionSettlementDocument extends DocumentData 
{
  date: number;
  orderId: string;
  productCode: string;
  megawariCouponAmount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：プロモーション精算内訳のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdPromotionSettlement 
{
  date: number;
  orderId: string;
  productCode: string;
  megawariCouponAmount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：プロモーション精算内訳CSVのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdPromotionSettlementCsvRow 
{
  注文番号: string;
  商品コード: string;
  'メガ割引クーポン1/2': string;
  購入者の決済日: string;
}
