import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IYahooCampaignCapitalRate,
  IYahooCampaignCapitalRateDocument,
  IYahooCampaignCapitalRateSheetRow,
} from './schema';
import { addDays, differenceInDays, parse } from 'date-fns';
import { parseAsiaTokyoTimeZone } from '../../../helper';

//-------------------------------------------------------------------------------
/**
 * Yahoo：倍々ストアキャンペーンのコンバータ
 */
//-------------------------------------------------------------------------------
export class YahooCampaignCapitalRateConverter implements FirestoreDataConverter<IYahooCampaignCapitalRate>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore( entity: IYahooCampaignCapitalRate ): IYahooCampaignCapitalRateDocument 
  {
    return {
      date: entity.date,
      value: entity.value,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooCampaignCapitalRateDocument> ): IYahooCampaignCapitalRate 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 連日の場合があるため、日数分の倍々参加原資倍率を作成する
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow( row: IYahooCampaignCapitalRateSheetRow ): IYahooCampaignCapitalRate[] 
  {
    // 日付から開始日と終了日を作成
    const startAt = parseAsiaTokyoTimeZone(parse(row['開始日'], 'yyyy/MM/dd', new Date()));
    const endAt = parseAsiaTokyoTimeZone(parse(row['終了日'], 'yyyy/MM/dd', new Date()) || new Date());

    // 開始日と終了日の差分の作成
    // 例題
    //  - diffDays：5
    //  - dates：[0, 1, 2, 3, 4]
    const diffDays = differenceInDays(endAt, startAt);
    const dates = Array.from({ length: diffDays }, (_, i) => i);

    if (dates.length === 0) {
      return [
        {
          date: startAt.getTime() || 0,
          value: Number(row['倍々参加原資倍率']) || 0,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        }
      ];
    }

    // 差分の日数があれば、その数だけ配列のデータを作成して返却
    return dates.map((i) => ({
      date: addDays(startAt, i).getTime() || 0,
      value: Number(row['倍々参加原資倍率']) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }));
  }
}
