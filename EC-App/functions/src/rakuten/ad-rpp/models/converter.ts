import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IRakutenAdRpp, IRakutenAdRppDocument, IRakutenAdRppCsvRow } from './schema';
import { addDays, differenceInDays, parse } from 'date-fns';

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP広告費データのコンバーター
 */
//-------------------------------------------------------------------------------
export class RakutenAdRppConverter implements FirestoreDataConverter<IRakutenAdRpp>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IRakutenAdRpp): IRakutenAdRppDocument 
  {
    return {
      // 日付
      // 商品管理番号
      // 実績額(合計)
      // 作成日 UnixTime
      // 更新日 UnixTime
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IRakutenAdRppDocument>): IRakutenAdRpp 
  {
    const data = snapshot.data();
    return {
      // 日付
      // 商品管理番号
      // 実績額(合計)
      // 作成日 UnixTime
      // 更新日 UnixTime
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
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IRakutenAdRppCsvRow): IRakutenAdRpp[] 
  {
    // CSVの日付から開始日と終了日を作成
    // RPPの「〜」の文字コード：129 69
    const dateStrs = row['日付'].split('～');
    const startAt = parse(dateStrs[0], 'yyyy年MM月dd日', new Date());
    const endAt = parse(dateStrs[1], 'yyyy年MM月dd日', new Date()) || new Date();

    // 開始日と終了日の差分を作成
    //  - diffDays：5
    //  - dates：[0, 1, 2, 3, 4]
    const diffDays = differenceInDays(endAt, startAt);

    /**
     * 同日の場合はそのまま返却
     */
    if (diffDays === 0) {
      return [
        {
          date: startAt.getTime() || 0,
          productControlCode: row["商品管理番号"] || '',
          amount: Number(row["実績額(合計)"]) || 0,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
      ];
    }

    const dates = Array.from({ length: diffDays }, (_, i) => i);

    // 差分のあった日付の数だけ繰り返してデータを返却する
    return dates.map((i) => ({
      // 日付
      // 商品管理番号
      // 実績額(合計)
      // 作成日 UnixTime
      // 更新日 UnixTime
      date: addDays(startAt, i).getTime() || 0,
      productControlCode: row['商品管理番号'] || '',
      amount: Number(row['実績額(合計)']) / diffDays || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    }));
  }
}
