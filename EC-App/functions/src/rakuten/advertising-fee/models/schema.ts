import { DocumentData } from 'firebase-admin/firestore';

/**広告費種別の種類 */
export type RakutenAdType =
  | '広告宣伝費'
  | '純広告費'
  | 'RPP広告費'
  | 'CA広告費'
  | 'TDA広告費'
  | 'おまけ分原価'
  | 'その他広告費'
  | 'DEAL掲載手数料';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdvertisingFeeDocument extends DocumentData 
{
  // 日付
  // 商品管理番号
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  amount: number;
  type: RakutenAdType;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdvertisingFee 
{
  // 日付
  // 商品管理番号
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  amount: number;
  type: RakutenAdType;
  createdAt: number;
  updatedAt: number;
}
