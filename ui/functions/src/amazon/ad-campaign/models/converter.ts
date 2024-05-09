import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { parse } from 'date-fns';
import ja from 'date-fns/locale/ja';
import {
  IAmazonAdCampaign,
  IAmazonAdCampaignDocument,
  IAmazonAdCampaignCsvRow,
} from './schema';
import { parseAsiaTokyoTimeZone } from '../../../helper';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンのコンバーター
 */
//-------------------------------------------------------------------------------
export class AmazonAdCampaignConverter implements FirestoreDataConverter<IAmazonAdCampaign>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonAdCampaign): IAmazonAdCampaignDocument 
  {
    return {
      startAt: entity.startAt,
      endAt: entity.endAt,
      campaign: entity.campaign,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IAmazonAdCampaignDocument> ): IAmazonAdCampaign 
  {
    const data = snapshot.data();
    return {
      startAt: data.startAt,
      endAt: data.endAt,
      campaign: data.campaign,
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
  fromCsvRow(row: IAmazonAdCampaignCsvRow): IAmazonAdCampaign 
  {
    return {
      startAt: parseAsiaTokyoTimeZone(parse(row['開始日'], 'yyyy/MM/dd', new Date(), {
        locale: ja,
      })).getTime() || 0,

      endAt: parseAsiaTokyoTimeZone(parse(row['終了日'], 'yyyy/MM/dd', new Date(), {
        locale: ja,
      })).getTime() || 0,

      campaign: row['キャンペーン'],
      amount: Number(row['広告費(JPY)']),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
