import { DocumentData } from 'firebase-admin/firestore';

/**利用項目 */
type ExpenseType =
  | 'PRオプション利用料'
  | 'ポイント原資'
  | 'キャンペーン原資'
  | 'プロモーションパッケージ利用料'
  | 'Yahoo!ショッピング　トリプル　300MBプラン'
  | string;

//-------------------------------------------------------------------------------
/**
 * Yahoo：請求明細ドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooClaimsDocument extends DocumentData 
{
  // 注文ID
  // 利用日
  // 利用項目
  // 金額（税抜き）
  // 作成日 UnixTime
  // 更新日 UnixTime
  orderId: string;
  orderAt: number;
  expenseType: ExpenseType;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：請求明細のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooClaims 
{
  // 注文ID
  // 利用日
  // 利用項目
  // 金額（税抜き）
  // 作成日 UnixTime
  // 更新日 UnixTime
  orderId: string;
  orderAt: number;
  expenseType: ExpenseType;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：請求明細CSVのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooClaimsCsvRow 
{
  利用日: string; // 'YYYY/MM/DD'
  注文ID: string;
  利用項目: string;
  '金額（税抜き）': string;
}
