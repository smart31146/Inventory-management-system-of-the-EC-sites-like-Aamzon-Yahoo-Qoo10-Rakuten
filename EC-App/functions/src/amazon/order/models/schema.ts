import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文データドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonOrderDocument extends DocumentData 
{
  // 注文ID
  // 注文日
  // sku
  // itemPromotionDiscount
  orderId: string;
  orderedAt: number;
  sku: string;
  itemPromotionDiscount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文データのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonOrder 
{
  // 注文ID
  // 注文日
  // sku
  // itemPromotionDiscount
  orderId: string;
  orderedAt: number;
  sku: string;
  itemPromotionDiscount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文データのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonOrderCsvRow 
{
  // 注文ID
  // 注文日
  // sku
  // itemPromotionDiscount
  'amazon-order-id': string;
  'purchase-date': string; // YYYY/MM/DD hh:mm:ss
  'sku': string;
  'item-promotion-discount': number;
}
