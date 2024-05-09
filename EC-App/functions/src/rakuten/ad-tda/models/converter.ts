import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IRakutenAdTda, IRakutenAdTdaDocument, IRakutenAdTdaCsvRow } from './schema';
import { parse } from 'date-fns';

//-------------------------------------------------------------------------------
/**
 * 楽天：TDA広告費のコンバーター
 */
//-------------------------------------------------------------------------------
export class RakutenAdTdaConverter implements FirestoreDataConverter<IRakutenAdTda>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IRakutenAdTda): IRakutenAdTdaDocument 
  {
    return {
      date: entity.date,
      campaignId: entity.campaignId,
      campaignName: entity.campaignName,
      amount: entity.amount,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IRakutenAdTdaDocument>): IRakutenAdTda 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      campaignId: data.campaignId,
      campaignName: data.campaignName,
      amount: data.amount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IRakutenAdTdaCsvRow): IRakutenAdTda 
  {
    return {
      date: parse(row['日付'], 'yyyy年MM月dd日', new Date()).getTime() || 0,
      campaignId: row['キャンペーンID'] || '',
      campaignName: row['キャンペーン名'] || '',
      amount: Number(row['実績額(円)']) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
