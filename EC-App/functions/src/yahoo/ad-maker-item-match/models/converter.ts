import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IYahooMakerItemMatch,
  IYahooMakerItemMatchDocument,
  IYahooMakerItemMatchCsvRow,
} from './schema';
import { addDays, differenceInDays, parse } from 'date-fns';

//-------------------------------------------------------------------------------
/**
 * Yahoo：メーカーアイテムマッチのコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooMakerItemMatchConverter implements FirestoreDataConverter<IYahooMakerItemMatch>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooMakerItemMatch): IYahooMakerItemMatchDocument 
  {
    return {
      date: entity.date,
      campaignId: entity.campaignId,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooMakerItemMatchDocument> ): IYahooMakerItemMatch 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      campaignId: data.campaignId,
      amount: data.amount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 連日の場合があるため、経過日数で利用金額を按分する
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IYahooMakerItemMatchCsvRow): IYahooMakerItemMatch[] 
  {
    // 日付から開始日と終了日を作成
    const startAt = parse(row['開始日'], 'MM/dd/yyyy HH:mm', new Date());
    const endAt = parse(row['終了日'], 'MM/dd/yyyy HH:mm', new Date()) || new Date();

    // 開始日と終了日の差分の作成
    // 例題
    //  - diffDays：5
    const diffDays = differenceInDays(endAt, startAt);

    // 同日の場合は差分を利用せずにそのまま返却
    // 最後の返却との違いは「date、amount」の設定が異なる
    if(diffDays === 0 || isNaN(diffDays)) {
      return [{
        date: startAt.getTime(),
        campaignId: row['キャンペーンID'],
        amount: Number(row['利用金額']),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }
    ]}

    // 開始日と終了日の差分の作成
    // 例題
    //  - dates：[0, 1, 2, 3, 4]
    const dates = Array.from({ length: diffDays }, (_, i) => i);

    // 差分の日数があれば、その数だけ配列のデータを作成して返却
    return dates.map((i) => ({
      date: addDays(startAt, i).getTime(),
      campaignId: row['キャンペーンID'],
      amount: Number(row['利用金額']) / diffDays,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }));
  }
}
