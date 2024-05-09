import { DocumentData } from 'firebase-admin/firestore';
//-------------------------------------------------------------------------------
/**
 * Amazon：キャンペーンのドキュメントのインターフェイス
 * キャンペーン名から対応する商品の子ASINを特定する
 */
//-------------------------------------------------------------------------------
export interface IAmazonCampaignToAsinDocument extends DocumentData 
{
  // 開始日
  // 終了日
  // キャンペーン
  // 子ASIN
  // 作成日 UnixTime
  // 更新日 UnixTime
  startAt: number;
  endAt: number;
  campaign: string;
  asin: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：キャンペーンのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonCampaignToAsin 
{
  // 開始日
  // 終了日
  // キャンペーン
  // 子ASIN
  // 作成日 UnixTime
  // 更新日 UnixTime
  startAt: number;
  endAt: number;
  campaign: string;
  asin: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：キャンペーンのCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonCampaignToAsinCsvRow 
{
  開始日: string; // YYYY/MM/DD
  終了日: string; // YYYY/MM/DD
  キャンペーン: string;
  子ASIN: string;
}
