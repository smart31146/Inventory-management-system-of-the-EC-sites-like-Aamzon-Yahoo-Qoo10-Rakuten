// Firebase関連
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

// インターフェイス関連
import {
  IRakutenCampaignIdToProductControlCode,
  IRakutenCampaignIdToProductControlCodeDocument,
  IRakutenCampaignIdToProductControlCodeSheetRow,
} from './schema';

//-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
export class RakutenCampaignIdToProductControlCodeConverter implements FirestoreDataConverter<IRakutenCampaignIdToProductControlCode>
{
  toFirestore(
    entity: IRakutenCampaignIdToProductControlCode
  ): IRakutenCampaignIdToProductControlCodeDocument {
    return {
      campaignId: entity.campaignId,
      productControlCode: entity.productControlCode,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IRakutenCampaignIdToProductControlCodeDocument> ): IRakutenCampaignIdToProductControlCode 
  {
    const data = snapshot.data();
    return {
      campaignId: data.campaignId,
      productControlCode: data.productControlCode,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow( row: IRakutenCampaignIdToProductControlCodeSheetRow ): IRakutenCampaignIdToProductControlCode 
  {
    return {
      campaignId: row['キャンペーンID'] || '',
      productControlCode: row['商品管理番号'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
