import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
    IAmazonAdOthers,
  IAmazonAdOthersDocument,
  IAmazonAdOthersSheetRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費_手入力分のコンバーター
 */
//-------------------------------------------------------------------------------
export class AmazonAdOthersConverter implements FirestoreDataConverter<IAmazonAdOthers>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonAdOthers): IAmazonAdOthersDocument 
  {
    return {
      date: entity.date,
      asin: entity.asin,
      amount: entity.amount,
      type: entity.type,
      campaign: entity.campaign,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IAmazonAdOthersDocument> ): IAmazonAdOthers 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      asin: data.asin,
      amount: data.amount,
      type: data.type,
      campaign: data.campaign,
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
  fromCsvRow(row: IAmazonAdOthersSheetRow): IAmazonAdOthers 
  {
    return {
      date: new Date(row['日付']).getTime() || 0,
      asin: row['子ASIN'] || '',
      amount: Number(row['金額']) || 0,
      type: row['広告費種別'] as AdType || '',
      campaign: '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
