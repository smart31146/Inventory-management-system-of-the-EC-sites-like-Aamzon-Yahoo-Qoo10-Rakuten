import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { addDays, differenceInDays, parse } from 'date-fns';
import { IDealToProductControlCode, IDealToProductControlCodeDocument, IDealToProductControlCodeSheetRow } from './schema';
import { parseAsiaTokyoTimeZone } from '../../../helper';

//-------------------------------------------------------------------------------
/**
 * 楽天：DEAL参加のコンバーター
 */
//-------------------------------------------------------------------------------
export class DealToProductControlCodeConverter implements FirestoreDataConverter<IDealToProductControlCode>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore( entity: IDealToProductControlCode ): IDealToProductControlCodeDocument 
  {
    return {
      date: entity.date,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IDealToProductControlCodeDocument> ): IDealToProductControlCode 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      productControlCode: data.productControlCode,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 連日の場合があるため、経過日数で実績額を按分する
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow( row: IDealToProductControlCodeSheetRow ): IDealToProductControlCode[] 
  {
    const startAt = parseAsiaTokyoTimeZone(parse(row['開始日'], 'yyyy/MM/dd', new Date()));
    const endAt = parseAsiaTokyoTimeZone(parse(row['終了日'], 'yyyy/MM/dd', new Date()));

    const diffDays = differenceInDays(endAt, startAt);

    /**
    * 同日の場合はそのまま返却
    */
    if(diffDays === 0) {
      return [{
        date: startAt.getTime() || 0,
        productControlCode: row['商品管理番号'] || '',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }
    ]}

    // 開始日と終了日の差分から配列を作成
    // 例
    //  - diffDays：5
    //  - dates：[0, 1, 2, 3, 4]
    const dates = Array.from({ length: diffDays }, (_, i) => i);

    return dates.map((i) => ({
      date: addDays(startAt, i).getTime() || 0,
      productControlCode: row['商品管理番号'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }))
  }
}
