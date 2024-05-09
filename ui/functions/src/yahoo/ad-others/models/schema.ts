import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 広告費種別
 */
//-------------------------------------------------------------------------------
export type AdType =
  | '純広告費'
  | 'アイテムマッチ広告費'
  | 'メーカーアイテムマッチ'
  | 'おまけ分原価'
  | 'その他広告費'
  | 'DEAL掲載手数料';

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費_手入力分ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooAdOthersDocument extends DocumentData 
{
  // 日付
  // 商品コード
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費_手入力分のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooAdOthers 
{
  // 日付
  // 商品コード
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費_手入力分のレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooAdOthersSheetRow 
{
  日付: string; // YYYY/MM/DD
  商品コード: string;
  金額: number;
  広告費種別: string;
}
