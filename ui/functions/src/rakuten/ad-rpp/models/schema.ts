import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP広告費データドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdRppDocument extends DocumentData 
{
  // 日付
  // 商品管理番号
  // 実績額(合計)
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP広告費データのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdRpp 
{
  // 日付
  // 商品管理番号
  // 実績額(合計)
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP広告費データのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdRppCsvRow 
{
  '日付': string; // YYYY年MM月DD日～YYYY年MM月DD日
  '商品管理番号': string;
  '実績額(合計)': string;
}
