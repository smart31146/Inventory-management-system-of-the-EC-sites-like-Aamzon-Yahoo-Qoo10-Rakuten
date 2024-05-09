import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Qoo10：スマートセールス広告ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdSmartSalesDocument extends DocumentData 
{
  // 注文番号
  // 商品コード
  // 販売金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  orderId: string;
  productCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：スマートセールス広告のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdSmartSales 
{
  // 注文番号
  // 商品コード
  // 販売金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  orderId: string;
  productCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：スマートセールス広告CSVのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdSmartSalesCsvRow 
{
  注文番号: string;
  商品コード: string;
  販売金額: string;
  購入者の決済日: string;
}
