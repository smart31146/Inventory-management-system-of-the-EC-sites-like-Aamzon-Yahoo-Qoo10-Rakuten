import { DocumentData } from 'firebase-admin/firestore';


//-------------------------------------------------------------------------------
/**
 * 楽天：キャンペーンIDドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenCampaignIdToProductControlCodeDocument extends DocumentData 
{
  // キャンペーンID
  // 商品管理番号
  // 作成日 UnxTime
  // 更新日 UnxTime
  campaignId: string;
  productControlCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：キャンペーンIDのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenCampaignIdToProductControlCode 
{
  // キャンペーンID
  // 商品管理番号
  // 作成日 UnxTime
  // 更新日 UnxTime
  campaignId: string;
  productControlCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * 楽天：キャンペーンIDのCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IRakutenCampaignIdToProductControlCodeSheetRow 
{
  キャンペーンID: string;
  商品管理番号: string;
}
