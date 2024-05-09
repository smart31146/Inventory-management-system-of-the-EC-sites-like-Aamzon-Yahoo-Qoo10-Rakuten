import { DocumentData } from 'firebase-admin/firestore';
//-------------------------------------------------------------------------------
/**
 * 広告費の種類
 */
//-------------------------------------------------------------------------------
export type AdType = 'SP広告費' | 'SB広告費' | 'SD広告費' | 'その他広告費';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdsKpiDocument extends DocumentData 
{
  // 商品
  // クリック数
  // コンバージョン率
  // 平均クリック単価 (CPC)(JPY)
  // クリック率  (CTR）
  // ROAS
  // 広告費(JPY)
  // 作成日 UnixTime
  // 更新日 UnixTime
  productId: string;
  click: number;
  cvr: number;
  cpc: number;
  cpa: number;
  ctr: number;
  roas: number;
  sales: number;
  conversion: number;
  adFee: number;
  date: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdsKpi
{
  // 商品
  // クリック数
  // コンバージョン率
  // 平均クリック単価 (CPC)(JPY)
  // クリック率  (CTR）
  // ROAS
  // 広告費(JPY)
  // 作成日 UnixTime
  // 更新日 UnixTime
  productId: string;
  click: number;
  cvr: number;
  cpc: number;
  cpa: number;
  ctr: number;
  roas: number;
  sales: number;
  adFee: number;
  conversion: number;
  date: number;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンCSVのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IAmazonAdsKpiCsvRow 
{
  商品: string;
  クリック数: number;
  コンバージョン率: number;
  '平均クリック単価 (CPC)(JPY)': number;
  'クリック率  (CTR）': number;
  ROAS: number;
  '広告費(JPY)': number;
  '売上(JPY)': number;
  date: number;
}
