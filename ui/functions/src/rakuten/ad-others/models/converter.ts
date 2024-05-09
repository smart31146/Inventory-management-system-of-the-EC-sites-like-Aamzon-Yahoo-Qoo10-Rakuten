import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IRakutenAdOthers, IRakutenAdOthersDocument, IRakutenAdOthersSheetRow } from './schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告費手入力分のコンバーター
 */
//-------------------------------------------------------------------------------
export class RakutenAdOthersConverter implements FirestoreDataConverter<IRakutenAdOthers>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IRakutenAdOthers): IRakutenAdOthersDocument 
  {
    return {
      date: entity.date,
      productControlCode: entity.productControlCode,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IRakutenAdOthersDocument>): IRakutenAdOthers 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      productControlCode: data.productControlCode,
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
  fromCsvRow(row: IRakutenAdOthersSheetRow): IRakutenAdOthers 
  {
    return {
      date: new Date(row['日付']).getTime() || 0,
      productControlCode: row['商品管理番号'] || '',
      amount: Number(row['金額']) || 0,
      type: row['広告費種別'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
