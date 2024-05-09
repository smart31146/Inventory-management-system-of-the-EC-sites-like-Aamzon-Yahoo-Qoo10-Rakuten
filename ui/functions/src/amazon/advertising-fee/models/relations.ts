import { IAmazonAdvertisingFee } from './schema';
import { AmazonAdvertisingFeeConverter } from './converter';
import { IAmazonAdCampaign } from '../../ad-campaign/models/schema';
import { IAmazonCampaignToAsin } from '../../campaign-to-asin/models/schema';
import { IAmazonAdOthers } from '../../ad-others/models/schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告のrelationsクラス
 */
//-------------------------------------------------------------------------------
export class Relations 
{
  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
  }

  //-------------------------------------------------------------------------------
  /**
   * 初期化処理
   * @returns 
   */
  //-------------------------------------------------------------------------------
  static init(): Relations 
  {
    return new Relations();
  }

  //-------------------------------------------------------------------------------
  /**
   * 全ての広告を日付ごとに取得
   *  1. 広告から指定した注文日のデータを取得
   *  2. returnで取得した広告を返却
   * @param orderedAt 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public getAllAdsByDate( orderedAt: number, adSource: {
    adCampaign: IAmazonAdCampaign[];
    campaign: IAmazonCampaignToAsin[];
    adOthers: IAmazonAdOthers[];
  }): IAmazonAdvertisingFee[] 
  {
    // Amazonキャンペーンのコンバーター作成
    const converter = new AmazonAdvertisingFeeConverter();

    // Firestoreから指定した注文日のデータを取得
    // そして習得したキャンペーンのデータをコンバーターに設定
    //  - 取得データ：Amazon広告費キャンペーン
    const adCampaign = adSource.adCampaign.filter((i) => i.startAt === orderedAt).map((campaign) =>
      converter.fromAdCampaign(campaign)
    );

    // Firestoreから指定した注文日のデータを取得
    //  - 取得データ：Amazon広告宣伝費手_入力分
    const adOthers = adSource.adOthers.filter((i) => i.date === orderedAt);

    // 取得した情報を返却
    return [...adCampaign];
  }
}
