import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 原価マスタドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface ICostMasterDocument extends DocumentData {
  brandName: string; // ブランド
  leoId: string; // 在庫ID
  productName: string; // 製品名（修正後）
  companyName: string; // 所属企業
  costPrice: number; // 原価
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 原価マスタのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface ICostMaster {
  brandName: string; // ブランド
  leoId: string; // 在庫ID
  productName: string; // 製品名（修正後）
  companyName: string; // 所属企業
  costPrice: number; // 原価
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 原価マスタスプシ情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface ICostMasterSheetRow {
  ブランド: string;
  在庫ID: string;
  '製品名（修正後）': string;
  所属企業: string;
  '原価': string;
}
