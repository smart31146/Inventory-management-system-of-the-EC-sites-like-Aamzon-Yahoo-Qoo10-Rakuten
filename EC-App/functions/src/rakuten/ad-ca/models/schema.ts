import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 楽天：CA広告費ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdCaDocument extends DocumentData 
{
  // 日付
  // 商品管理番号
  // 実績額
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
 * 楽天：CA広告費のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdCa 
{
  // 日付
  // 商品管理番号
  // 実績額
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
 * 楽天：CA広告費のレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenAdCaCsvRow 
{
  日付: string; // YYYY年MM月DD日～YYYY年MM月DD日
  商品管理番号: string;
  実績額: string;
}
