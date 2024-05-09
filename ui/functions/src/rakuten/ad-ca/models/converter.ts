import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IRakutenAdCa, IRakutenAdCaDocument, IRakutenAdCaCsvRow } from './schema';
import { addDays, differenceInDays, parse } from 'date-fns';

//-------------------------------------------------------------------------------
/**
 * 楽天：CA広告費のコンバーター
 */
//-------------------------------------------------------------------------------
export class RakutenAdCaConverter implements FirestoreDataConverter<IRakutenAdCa>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IRakutenAdCa): IRakutenAdCaDocument {
    return {
      date: entity.date,
      productControlCode: entity.productControlCode,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IRakutenAdCaDocument>): IRakutenAdCa 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      productControlCode: data.productControlCode,
      amount: data.amount,
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
  fromCsvRow(row: IRakutenAdCaCsvRow): IRakutenAdCa[] 
  {
    // 日付から開始日と終了日を作成
    const dateStrs = row['日付'].split('～');
    const startAt = parse(dateStrs[0], 'yyyy年MM月dd日', new Date());
    const endAt = parse(dateStrs[1], 'yyyy年MM月dd日', new Date()) || new Date();

    // 開始日と終了日の差分の作成
    // 例題
    //  - diffDays：5
    //  - dates：[0, 1, 2, 3, 4]
    const diffDays = differenceInDays(endAt, startAt);

    /**
     * 同日の場合はそのまま返却
     */
    if(diffDays === 0) {
      return [{
        date: startAt.getTime(),
        productControlCode: row['商品管理番号'],
        amount: Number(row['実績額']),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }
    ]}

    const dates = Array.from({ length: diffDays }, (_, i) => i);

    // 差分の日数があれば、その数だけ配列のデータを作成して返却
    return dates.map((i) => ({
      date: addDays(startAt, i).getTime(),
      productControlCode: row['商品管理番号'],
      amount: Number(row['実績額']) / diffDays,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }));
  }
}
