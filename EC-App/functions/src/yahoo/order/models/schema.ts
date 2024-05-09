import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文データドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooOrderDocument extends DocumentData 
{
  // Id
  // 注文ID
  // LineID
  // 商品コード
  // 商品名
  // 単価
  // 数量
  // 小計
  // クーポン割引
  Id: string;
  orderId: string;
  orderedAt: number;
  lineId: string;
  productCode: string;
  productName: string;
  productUnitPrice: number;
  quantity: number;
  subTotal: number;
  couponDiscount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文データのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooOrder 
{
  // Id
  // 注文ID
  // LineID
  // 商品コード
  // 商品名
  // 単価
  // 数量
  // 小計
  // クーポン割引
  Id: string;
  orderId: string;
  orderedAt: number;
  lineId: string;
  productCode: string;
  productName: string;
  productUnitPrice: number;
  quantity: number;
  subTotal: number;
  couponDiscount: number;
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文データのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooOrderCsvRow 
{
  // Id
  // 注文ID
  // 注文日（暫定で注文日扱いとする）
  // LineID
  // アイテムID
  // 商品名
  // 単価
  // 数量
  // 小計
  // クーポン割引
  Id: string
  OrderId: string;
  LeadTimeStart: string; // yyyy/mm/dd
  LineId: string;
  ItemId: string;
  Title: string;
  UnitPrice: string;
  Quantity: string;
  LineSubTotal: string;
  CouponDiscount: string;
}
