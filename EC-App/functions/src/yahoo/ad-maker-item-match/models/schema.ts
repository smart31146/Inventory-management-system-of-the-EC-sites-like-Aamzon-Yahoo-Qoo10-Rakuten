import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Yahoo：メーカーアイテムマッチドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooMakerItemMatchDocument extends DocumentData 
{
  // 開始日
  // 終了日
  // キャンペーンID
  // 利用金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  campaignId: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：メーカーアイテムマッチのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooMakerItemMatch 
{
  // 開始日
  // 終了日
  // キャンペーンID
  // 利用金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  campaignId: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：メーカーアイテムマッチCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooMakerItemMatchCsvRow 
{
  開始日: string; // YYYY/MM/DD HH:mm:ss
  終了日: string; // YYYY/MM/DD HH:mm:ss or 空文字
  キャンペーンID: string;
  利用金額: string;
}
