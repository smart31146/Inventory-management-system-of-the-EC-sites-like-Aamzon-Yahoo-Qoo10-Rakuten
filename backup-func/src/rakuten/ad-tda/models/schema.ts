import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 楽天：TDA広告費ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdTdaDocument extends DocumentData 
{
  // 日付
  // キャンペーンID
  // キャンペーン名
  // 実績額(円)
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  campaignId: string;
  campaignName: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：TDA広告費のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdTda 
{
  // 日付
  // キャンペーンID
  // キャンペーン名
  // 実績額(円)
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  campaignId: string;
  campaignName: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：TDA広告費のレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdTdaCsvRow 
{
  日付: string; // YYYY年MM月DD日
  キャンペーンID: string;
  キャンペーン名: string;
  '実績額(円)': string;
}
