import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdCartDiscountDocument extends DocumentData 
{
  // 注文番号
  // カート割引金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  orderId: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdCartDiscount 
{
  // 注文番号
  // カート割引金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  orderId: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引CSVのレコード情報のインターフェイス
 *  - 注文番号は複数ある場合があり, ' | ' で連結されている
 *    例: xxxxxxxx | yyyyyyyy | zzzzzzzz
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdCartDiscountCsvRow 
{
  注文番号: string; // xxxxxxxx | yyyyyyyy | zzzzzzzz
  カート割引金額: string;
  発生日: string;
}
