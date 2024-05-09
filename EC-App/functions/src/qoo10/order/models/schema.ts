import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Qoo10：注文データドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10OrderDocument extends DocumentData 
{
  // 注文番号
  // 購入者の決済日
  // 商品コード
  // 販売店舗負担割引金額
  orderId: string;
  orderedAt: number;
  productCode: string;
  storeDiscountAmount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：注文データのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10Order 
{
  // 注文番号
  // 購入者の決済日
  // 商品コード
  // 販売店舗負担割引金額
  orderId: string;
  orderedAt: number;
  productCode: string;
  storeDiscountAmount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：注文データのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10OrderCsvRow 
{
  注文番号: string;
  購入者の決済日: string; // YYYY/MM/DD
  商品コード: string;
  販売店舗負担割引金額: number;
}
