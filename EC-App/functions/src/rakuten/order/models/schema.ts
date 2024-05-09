import { DocumentData } from 'firebase-admin/firestore';
//import { TaxRatio } from '../../../helper/types';

//-------------------------------------------------------------------------------
/**
 * 楽天：注文データドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenOrderDocument extends DocumentData 
{
  // 注文番号
  // 商品管理番号
  // 注文日
  // クーポン利用額
  // ポイント倍率
  // 数量
  orderId: string;
  orderedAt: number;
  productControlCode: string;
  subTotal: number;
  productUnitPrice: number;
  storeCouponAmount: number;
  pointRate: number;
  pointAmount: number;
  quantity: number;
  /*必須項目でないがもしかすると必要になるかもしれない項目をコメントアウト
  // 
  totalCouponAmount: number;
  storeCouponCode: string;
  storeCouponName: string;
  rakutenCouponCode: string;
  rakutenCouponName: string;
  rakutenCouponAmount: number;
  rakutenSuperDealFlag: 0 | 1;
  */
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：注文データのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenOrder 
{
  // 注文番号
  // 商品管理番号
  // 注文日
  // クーポン利用額
  // ポイント倍率
  // 数量
  orderId: string;
  orderedAt: number;
  productControlCode: string;
  subTotal: number;
  productUnitPrice: number;
  storeCouponAmount: number;
  pointRate: number;
  pointAmount: number;
  quantity: number;
  /*必須項目でないがもしかすると必要になるかもしれない項目をコメントアウト
  // 
  totalCouponAmount: number;
  storeCouponCode: string;
  storeCouponName: string;
  rakutenCouponCode: string;
  rakutenCouponName: string;
  rakutenCouponAmount: number;
  rakutenSuperDealFlag: 0 | 1;
  */
  // 作成日 UnixTime
  // 更新日 UnixTime
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：注文データのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenOrderCsvRow 
{
  // CSV：注文番号
  // CSV：商品管理番号
  // CSV：注文日（YYYY/MM/DD）
  // CSV：クーポン利用額
  // CSV：ポイント倍率
  注文番号: string;
  商品管理番号: string;
  注文日: string;
  店舗発行クーポン利用額: string;
  ポイント倍率: string;
  ポイント利用額: string;
  商品合計金額: string;
  単価: string;
  個数: string;
  /*必須項目でないがもしかすると必要になるかもしれない項目をコメントアウト
  // 
  注文日時: string; // YYYY-MM-DD hh:mm:ss
  消費税合計: string;
  送料合計: string;
  代引料合計: string;
  請求金額: string;
  合計金額: string;
  クーポン利用総額: string;
  楽天発行クーポン利用額: string;
  商品ID: string;
  商品名: string;
  商品番号: string;
  楽天スーパーDEAL商品受注フラグ: 0 | 1;
  商品税率: TaxRatio;
  店舗発行クーポンコード: string;
  店舗発行クーポン名: string;
  楽天発行クーポンコード: string;
  楽天発行クーポン名: string;
  */
}
