import { DocumentData } from 'firebase-admin/firestore';

/**広告費種別 */
export type AdType = 
  | 'プレミアムタイムセール枠広告費'
  | '共同購入広告費'
  | 'プラス展示広告費'
  | 'パワーランクアップ広告費'
  | 'スマートセールス広告費'
  | 'おまけ分原価'
  | 'その他広告費';

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdOthersDocument extends DocumentData 
{
  // 日付
  // 商品コード
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdOthers 
{
  // 日付
  // 商品コード
  // 金額
  // 広告費種別
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分のレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IQoo10AdOthersSheetRow 
{
  日付: string; // YYYY/MM/DD
  商品コード: string;
  金額: number;
  広告費種別: string;
}
