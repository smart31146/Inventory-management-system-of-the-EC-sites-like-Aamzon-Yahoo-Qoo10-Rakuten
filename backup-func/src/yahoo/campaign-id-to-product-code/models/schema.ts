import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンIDのドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignIdToProductCodeDocument extends DocumentData 
{
  // キャンペーンID
  // 商品コード
  // 作成日 UnixTime
  // 更新日 UnixTime
  campaignId: string;
  productCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンIDのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignIdToProductCode 
{
  // キャンペーンID
  // 商品コード
  // 作成日 UnixTime
  // 更新日 UnixTime
  campaignId: string;
  productCode: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンIDのCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IYahooCampaignIdToProductCodeSheetRow 
{
  キャンペーンID: string;
  商品コード: string;
}
