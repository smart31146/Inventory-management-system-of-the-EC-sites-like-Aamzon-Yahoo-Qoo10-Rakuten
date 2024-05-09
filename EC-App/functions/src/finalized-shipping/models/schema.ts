import { DocumentData } from 'firebase-admin/firestore';
import { SalesChannel, TaxRatio } from '../../helper/types';

export type Tenant = 'RSL' | 'FBA' | 'SEIWA_YAHOO' | 'SEIWA_QOO10';

//-------------------------------------------------------------------------------
/**
 * DBに保存するクラウドロジ売上確定データ
 */
//-------------------------------------------------------------------------------
export interface IFinalizedShippingDocument extends DocumentData {
  orderId: string;
  inventoryId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  shippingFee: number;
  commissionFee: number;
  promotionDiscount: number;
  finalizedAt: number; // UnixTime
  salesChannel: SalesChannel;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 *
 */
//-------------------------------------------------------------------------------
export interface IFinalizedShipping {
  orderId: string;
  inventoryId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  shippingFee: number;
  commissionFee: number;
  promotionDiscount: number;
  finalizedAt: number; // UnixTime
  salesChannel: SalesChannel;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 *
 */
//-------------------------------------------------------------------------------
export interface IFinalizedShippingCsv {
  ショップ名: string;
  注文番号: string;
  在庫ID: string;
  商品名: string;
  単価: number;
  数量: number;
  合計金額: number;
  税率: TaxRatio;
  送料: number;
  手数料: number;
  出荷確定日: string; // YYYY/MM/DD
  自由項目1: string; // FBAテナントはこのカラムが出荷確定日
  '取込フォーマット名（APIカート内ショップ名）': string;
  自由項目2: string;
  商品管理番号: string;
  個数: number;
  配送方法: string;
  注文確定日時: string;
  Id?: string;
  OrderId: string;
  ItemId: string;
  Title: string;
  UnitPrice: number;
  Quantity: number;
  LeadTimeStart: string;
  販売者コード: string;
  販売者オプションコード: string;
  販売価格: string;
  購入者の決済日: string;
  販売店負担割引金額: number;
  店舗発行クーポン利用額: number;
  'amazon-order-id': string;
  'item-status': string;
  sku: string;
  'product-name': string;
  CouponDiscount: number;
  'item-price': number;
  quantity: number;
  'shipping-price': number;
  'item-promotion-discount': number;
  'purchase-date': string;
  SubCode: string;
  ItemOptionValue: string;
  オプション情報: string;
}
