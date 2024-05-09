import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
  IYahooAdOthers,
  IYahooAdOthersDocument,
  IYahooAdOthersSheetRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費_手入力分のコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooAdOthersConverter implements FirestoreDataConverter<IYahooAdOthers>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooAdOthers): IYahooAdOthersDocument 
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooAdOthersDocument> ): IYahooAdOthers 
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
   * @param aggregatedDate 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IYahooAdOthersSheetRow): IYahooAdOthers 
  {
    return {
      date: new Date(row['日付']).getTime() || 0,
      productCode: row['商品コード'] || '',
      amount: Number(row['金額']) || 0,
      type: row['広告費種別'] as AdType || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
