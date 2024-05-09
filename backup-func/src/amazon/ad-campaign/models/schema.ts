import { DocumentData } from 'firebase-admin/firestore';
//-------------------------------------------------------------------------------
/**
 * 広告費の種類
 */
//-------------------------------------------------------------------------------
export type AdType = 'SP広告費' | 'SB広告費' | 'SD広告費' | 'その他広告費';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdCampaignDocument extends DocumentData 
{
  // 開始日
  // 終了日
  // キャンペーン
  // 広告費(JPY)
  // 作成日 UnixTime
  // 更新日 UnixTime
  startAt: number;
  endAt: number;
  campaign: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdCampaign 
{
  // 開始日
  // 終了日
  // キャンペーン
  // 広告費(JPY)
  // 作成日 UnixTime
  // 更新日 UnixTime
  startAt: number;
  endAt: number;
  campaign: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンCSVのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdCampaignCsvRow 
{
  開始日: string; // YYYY/MM/DD
  終了日: string; // YYYY/MM/DD
  キャンペーン: string;
  '広告費(JPY)': number;
}
