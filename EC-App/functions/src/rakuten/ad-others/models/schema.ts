import { DocumentData } from 'firebase-admin/firestore';

/**広告費種別の種類 */
export type RakutenAdType =
  | '純広告費'
  | 'おまけ分原価'
  | 'その他広告費';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告費手入力分ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdOthersDocument extends DocumentData 
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
 * 楽天：広告費手入力分のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdOthers 
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
 * 楽天：広告費手入力分CSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdOthersSheetRow 
{
  日付: string; // YYYY/MM/DD
  商品管理番号: string;
  金額: number;
  広告費種別: RakutenAdType;
}
