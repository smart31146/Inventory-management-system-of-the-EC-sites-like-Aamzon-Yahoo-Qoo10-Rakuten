import { DocumentData } from 'firebase-admin/firestore';

export type AdType =
  | 'プレミアムタイムセール枠広告費'
  | '共同購入広告費'
  | 'プラス展示広告費'
  | 'パワーランクアップ広告費'
  | 'スマートセールス広告費'
  | 'おまけ分原価'
  | 'その他広告費';

/**
 * Qoo10広告費　(広告宣伝費)
 */
export interface IQoo10AdvertisingFeeDocument extends DocumentData {
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

export interface IQoo10AdvertisingFee {
  date: number;
  productCode: string;
  amount: number;
  type: AdType;
  createdAt: number;
  updatedAt: number;
}

export interface IQoo10AdvertisingFeeSheetRow {
  日付: string; // YYYY/MM/DD
  商品コード: string;
  金額: number;
  広告費種別: string;
}
