import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Yahoo：倍々ストアキャンペーンのドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignCapitalRateDocument extends DocumentData 
{
  // 開始日
  // 終了日
  // 倍々参加原資倍率
  // 作戦日 UnixTime
  // 更新日 UnixTime
  date: number;
  value: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：倍々ストアキャンペーンのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignCapitalRate 
{
  // 開始日
  // 終了日
  // 倍々参加原資倍率
  // 作戦日 UnixTime
  // 更新日 UnixTime
  date: number;
  value: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：倍々ストアキャンペーンのCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignCapitalRateSheetRow 
{
  開始日: string; // YYYY/MM/DD
  終了日: string; // YYYY/MM/DD
  倍々参加原資倍率: number;
}
