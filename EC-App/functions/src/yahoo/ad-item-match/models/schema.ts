import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Yahoo：アイテムマッチドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooItemMatchDocument extends DocumentData 
{
  // ストアアカウント
  // 商品コード
  // 利用金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  storeAccount: string;
  productCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：アイテムマッチのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooItemMatch 
{
  // ストアアカウント
  // 商品コード
  // 利用金額
  // 作成日 UnixTime
  // 更新日 UnixTime
  date: number;
  storeAccount: string;
  productCode: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：アイテムマッチCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooItemMatchCsvRow 
{
  ストアアカウント: string;
  商品コード: string; // ストアアカウント + '_' + '商品コード'
  利用金額: string;
}
