import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
  IAmazonAdvertisingFee,
  IAmazonAdvertisingFeeDocument,
  IAmazonAdvertisingFeeSheetRow,
} from './schema';
import { IAmazonAdCampaign } from '../../ad-campaign/models/schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費のコンバーター
 */
//-------------------------------------------------------------------------------
export class AmazonAdvertisingFeeConverter implements FirestoreDataConverter<IAmazonAdvertisingFee>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonAdvertisingFee): IAmazonAdvertisingFeeDocument 
  {
    return {
      date: entity.date,
      asin: entity.asin,
      amount: entity.amount,
      type: entity.type,
      campaign: entity.campaign,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IAmazonAdvertisingFeeDocument> ): IAmazonAdvertisingFee 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      asin: data.asin,
      amount: data.amount,
      type: data.type,
      campaign: data.campaign,
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
  fromCsvRow(row: IAmazonAdvertisingFeeSheetRow): IAmazonAdvertisingFee 
  {
    return {
      date: new Date(row['日付']).getTime(),
      asin: row['子ASIN'],
      amount: Number(row['金額']),
      type: row['広告費種別'] as AdType,
      campaign: '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Amazon広告費キャンペーンからのデータ取得
   * @param campaign 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromAdCampaign(campaign: IAmazonAdCampaign): IAmazonAdvertisingFee 
  {
    return {
      date: campaign.startAt,
      asin: campaign.campaign,
      amount: campaign.amount,
      type: '' as AdType,
      campaign: campaign.campaign,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
