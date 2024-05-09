import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IYahooCampaignIdToProductCode,
  IYahooCampaignIdToProductCodeSheetRow,
  IYahooCampaignIdToProductCodeDocument,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンIDのコンバータ
 */
//-------------------------------------------------------------------------------
export class YahooCampaignIdToProductCodeConverter implements FirestoreDataConverter<IYahooCampaignIdToProductCode>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore( entity: IYahooCampaignIdToProductCode ): IYahooCampaignIdToProductCodeDocument 
  {
    return {
      campaignId: entity.campaignId,
      productCode: entity.productCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooCampaignIdToProductCodeDocument> ): IYahooCampaignIdToProductCode 
  {
    const data = snapshot.data();
    return {
      campaignId: data.campaignId,
      productCode: data.productCode,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 連日の場合があるため、日数分の倍々参加原資倍率を作成する
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow( row: IYahooCampaignIdToProductCodeSheetRow ): IYahooCampaignIdToProductCode
  {
    return {
      campaignId: row['キャンペーンID'] || '',
      productCode: row['商品コード'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
