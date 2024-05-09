import { YahooAdvertisingFeeConverter } from './converter';
import { IYahooAdvertisingFee } from './schema';
import { IYahooItemMatch } from '../../ad-item-match/models/schema';
import { IYahooMakerItemMatch } from '../../ad-maker-item-match/models/schema';
import { IYahooCampaignIdToProductCode } from '../../campaign-id-to-product-code/models/schema';
import { IYahooAdOthers } from '../../ad-others/models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告のrelationsクラス
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
    itemMatch: IYahooItemMatch[];
    makerItemMatch: IYahooMakerItemMatch[];
    campaign: IYahooCampaignIdToProductCode[];
    adOthers: IYahooAdOthers[];
  }): IYahooAdvertisingFee[] 
  {
    // Converter作成
    const converter = new YahooAdvertisingFeeConverter();

    // ConverterにYahooアイテムマッチのデータ設定
    //  - 指定した注文日のYahooアイテムマッチのデータをConverterに設定
    const itemMatch = adSource.itemMatch.filter((i) => i.date === orderedAt).map(
      (im) => converter.fromItemMatch(im)
    );

    // Firestoreから指定した注文日のデータを取得
    //  - 取得データ：Yahooアイテムマッチ
    const makerItemMatch = adSource.makerItemMatch.filter((i) => i.date === orderedAt);

    // YahooアイテムマッチのキャンペーンIDと一致するYahooキャンペーンIDデータを取得
    const makerItemMatchWithControlCode = makerItemMatch.map((mim) => {
      const campaign = adSource.campaign.find(
        (i) => i.campaignId === mim.campaignId
      );
      if (!campaign) {
        throw new Error(`campaign not found. campaignId: ${mim.campaignId}`);
      }

      // ConverterにYahooアイテムマッチのデータ設定
      return converter.fromMakerItemMatch(mim, campaign.productCode);
    });

    // Firestoreから指定した注文日のデータを取得
    //  - 取得データ：Yahoo広告宣伝費_手入力分
    const adOthers = adSource.adOthers.filter((i) => i.date === orderedAt);

    // 取得した情報を返却
    return [...itemMatch, ...makerItemMatchWithControlCode, ...adOthers];
  }
}
