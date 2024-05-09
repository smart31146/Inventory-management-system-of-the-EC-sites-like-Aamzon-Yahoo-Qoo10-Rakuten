import { DocumentData } from 'firebase-admin/firestore';

/**広告費種別の種類 */
export type AdType = 'SP広告費' | 'SB広告費' | 'SD広告費' | 'その他広告費' | "セール販促費";

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費_手入力分ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdOthersDocument extends DocumentData 
{
  // 日付
  // 子ASIN
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  asin: string;
  amount: number;
  type: AdType;
  campaign: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費_手入力分のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdOthers 
{
  // 日付
  // 子ASIN
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  asin: string;
  amount: number;
  type: AdType;
  campaign: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費_手入力分CSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdOthersSheetRow 
{
  日付: string; // YYYY/MM/DD
  子ASIN: string;
  金額: number;
  広告費種別: string;
}
