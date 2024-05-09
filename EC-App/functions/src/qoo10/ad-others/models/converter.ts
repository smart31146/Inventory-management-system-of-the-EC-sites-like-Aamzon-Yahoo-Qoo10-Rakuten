import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
  IQoo10AdOthers,
  IQoo10AdOthersDocument,
  IQoo10AdOthersSheetRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分のコンバーター
 */
//-------------------------------------------------------------------------------
export class Qoo10AdOthersConverter implements FirestoreDataConverter<IQoo10AdOthers>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IQoo10AdOthers): IQoo10AdOthersDocument 
  {
    return {
      date: entity.date,
      productCode: entity.productCode,
      amount: entity.amount,
      type: entity.type,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IQoo10AdOthersDocument> ): IQoo10AdOthers 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      productCode: data.productCode,
      amount: data.amount,
      type: data.type,
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
  fromCsvRow(row: IQoo10AdOthersSheetRow): IQoo10AdOthers 
  {
    return {
      date: new Date(row['日付']).getTime() || 0,
      productCode: row['商品コード'] || '',
      amount: Number(row['金額']) || 0,
      type: row['広告費種別'] as AdType,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
