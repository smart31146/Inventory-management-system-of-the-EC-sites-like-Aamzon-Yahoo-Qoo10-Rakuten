import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { parse } from 'date-fns';
import ja from 'date-fns/locale/ja';
import {
  IAmazonCampaignToAsin,
  IAmazonCampaignToAsinDocument,
  IAmazonCampaignToAsinCsvRow,
} from './schema';
import { parseAsiaTokyoTimeZone } from '../../../helper';

//-------------------------------------------------------------------------------
/**
 * Amazon：キャンペーンのコンバータ
 */
//-------------------------------------------------------------------------------
export class AmazonCampaignToAsinConverter implements FirestoreDataConverter<IAmazonCampaignToAsin>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonCampaignToAsin): IAmazonCampaignToAsinDocument 
  {
    return {
      startAt: entity.startAt,
      endAt: entity.endAt,
      campaign: entity.campaign,
      asin: entity.asin,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IAmazonCampaignToAsinDocument> ): IAmazonCampaignToAsin 
  {
    const data = snapshot.data();
    return {
      startAt: data.startAt,
      endAt: data.endAt,
      campaign: data.campaign,
      asin: data.asin,
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
  fromCsvRow(row: IAmazonCampaignToAsinCsvRow): IAmazonCampaignToAsin 
  {
    return {
      startAt: parseAsiaTokyoTimeZone(parse(row['開始日'], 'yyyy/MM/dd', new Date(), {
        locale: ja,
      })).getTime() || 0,

      endAt: parseAsiaTokyoTimeZone(parse(row['終了日'], 'yyyy/MM/dd', new Date(), {
        locale: ja,
      })).getTime() || 0,

      campaign: row['キャンペーン'] || '',
      asin: row['子ASIN'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
