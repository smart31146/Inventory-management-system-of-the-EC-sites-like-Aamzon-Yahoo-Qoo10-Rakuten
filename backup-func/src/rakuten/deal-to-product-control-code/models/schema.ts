import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 楽天：DEAL参加ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDealToProductControlCodeDocument extends DocumentData 
{
  // 日付
  // 商品管理番号
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：DEAL参加のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDealToProductControlCode 
{
  // 日付
  // 商品管理番号
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productControlCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：DEAL参加スプレッドシート情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDealToProductControlCodeSheetRow 
{
  開始日: string; // YYYY/MM/DD
  終了日: string; // YYYY/MM/DD
  商品管理番号: string;
}
