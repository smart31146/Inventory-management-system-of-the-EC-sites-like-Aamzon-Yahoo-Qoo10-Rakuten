import { runTime } from '../../helper';
import { topics } from '../topics';
import { rakutenAdCaRun } from '../../rakuten/ad-ca/batch';
import { rakutenAdRppRun } from '../../rakuten/ad-rpp/batch';
import { rakutenAdTdaRun } from '../../rakuten/ad-tda/batch';
import { rakutenDealToProductControlCodeRun } from '../../rakuten/deal-to-product-control-code/batch';
import { rakutenCampaignIdCodeRun } from '../../rakuten/campaign-id-to-product-control-code/batch';
import { rakutenAdOthersRun } from '../../rakuten/ad-others/batch';
import { amazonAdCampaignRun } from '../../amazon/ad-campaign/batch';
import { amazonCampaignToAsinRun } from '../../amazon/campaign-to-asin/batch';
import { amazonAdOthersRun } from '../../amazon/ad-others/batch';
import { amazonAdsKpiRun } from '../../amazon/ads-kpi/batch';
import { yahooAdItemRun } from '../../yahoo/ad-item-match/batch';
import { yahooAdMakerItemRun } from '../../yahoo/ad-maker-item-match/batch';
import { yahooCampaignIdCodeRun } from '../../yahoo/campaign-id-to-product-code/batch';
import { yahooCampaignCapitalRateRun } from '../../yahoo/campaign-capital-rate/batch';
import { yahooClaimsRun } from '../../yahoo/claims/batch';
import { yahooAdOthersRun } from '../../yahoo/ad-others/batch';
import { qoo10AdSmartSaleRun } from '../../qoo10/ad-smart-sales/batch';
import { qoo10AdCartDiscountRun } from '../../qoo10/ad-cart-discount/batch';
import { qoo10AdPromotionRun } from '../../qoo10/ad-promotion-settlement/batch';
import { qoo10AdOthersRun } from '../../qoo10/ad-others/batch';
import { PubSub } from '@google-cloud/pubsub';

type Params = {
  /**
   * 集計日
   * CSVファイル名の検索に利用する
   * @required
   * @format YYYY-MM-DD
   */
  aggregatedAt: string;

  /**
   * 広告費種別
   * 特定の広告費データを対象にする場合に指定する
   * @optional
   */
  adType?:
    | 'rakuten-ad-ca'
    | 'rakuten-ad-rpp'
    | 'rakuten-ad-tda'
    | 'rakuten-ad-others'
    | 'rakuten-deal-to-product-control'
    | 'rakuten-campaign-id-to-product-control-code'
    | 'amazon-ad-campaign'
    | 'amazon-campaign-to-asin'
    | 'amazon-ad-others'
    | 'amazon-ads-kpi'
    | 'yahoo-ad-item-match'
    | 'yahoo-ad-maker-item-match'
    | 'yahoo-campaign-id-to-product-code'
    | 'yahoo-campaign-capital-rate'
    | 'yahoo-claims'
    | 'yahoo-ad-others'
    | 'qoo10-ad-smart-sales'
    | 'qoo10-ad-cart-discount'
    | 'qoo10-ad-promotion-settlement'
    | 'qoo10-ad-others';
};

export const advertisingFee = runTime.pubsub
  .topic(topics.batch.advertisingFee)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.advertisingFee}`);

    const params = message.json?.params as Params | undefined;
    const date =
      params?.aggregatedAt &&
      typeof params.aggregatedAt !== 'undefined' &&
      params.aggregatedAt !== ''
        ? new Date(params.aggregatedAt)
        : new Date();
    const adType = params?.adType;
    
    date.setHours(0, 0, 0, 0);
    let aggregatedAt = new Date(date.toLocaleString('en-US'))

    switch (adType) {
      case 'rakuten-ad-ca':
        await rakutenAdCaRun(aggregatedAt);
        break;
      case 'rakuten-ad-rpp':
        await rakutenAdRppRun(aggregatedAt);
        break;
      case 'rakuten-ad-tda':
        await rakutenAdTdaRun(aggregatedAt);
        break;
      case 'rakuten-deal-to-product-control':
        await rakutenDealToProductControlCodeRun();
        break;
      case 'rakuten-campaign-id-to-product-control-code':
        await rakutenCampaignIdCodeRun();
        break;
      case 'rakuten-ad-others':
        await rakutenAdOthersRun();
        break;
      case 'amazon-ad-campaign':
        await amazonAdCampaignRun(aggregatedAt);
        break;
      case 'amazon-campaign-to-asin':
        await amazonCampaignToAsinRun();
        break;
      case 'amazon-ad-others':
        await amazonAdOthersRun();
        break;
      case 'amazon-ads-kpi':
        await amazonAdsKpiRun(aggregatedAt);
        break;
      case 'yahoo-ad-item-match':
        await yahooAdItemRun(aggregatedAt);
        break;
      case 'yahoo-ad-maker-item-match':
        await yahooAdMakerItemRun(aggregatedAt);
        break;
      case 'yahoo-campaign-id-to-product-code':
        await yahooCampaignIdCodeRun();
        break;
      case 'yahoo-campaign-capital-rate':
        await yahooCampaignCapitalRateRun();
        break;
      case 'yahoo-claims':
        await yahooClaimsRun(aggregatedAt);
        break;
      case 'yahoo-ad-others':
        await yahooAdOthersRun();
        break;
      case 'qoo10-ad-smart-sales':
        await qoo10AdSmartSaleRun(aggregatedAt);
        break;
      case 'qoo10-ad-cart-discount':
        await qoo10AdCartDiscountRun(aggregatedAt);
        break;
      case 'qoo10-ad-promotion-settlement':
        await qoo10AdPromotionRun(aggregatedAt);
        break;
      case 'qoo10-ad-others':
        await qoo10AdOthersRun();
        break;
      default:
        await Promise.allSettled([
          rakutenAdCaRun(aggregatedAt),
          rakutenAdRppRun(aggregatedAt),
          rakutenAdTdaRun(aggregatedAt),
          rakutenDealToProductControlCodeRun(),
          rakutenCampaignIdCodeRun(),
          rakutenAdOthersRun(),
          amazonAdCampaignRun(aggregatedAt),
          amazonCampaignToAsinRun(),
          amazonAdOthersRun(),
          amazonAdsKpiRun(aggregatedAt),
          yahooAdItemRun(aggregatedAt),
          yahooAdMakerItemRun(aggregatedAt),
          yahooCampaignIdCodeRun(),
          yahooCampaignCapitalRateRun(),
          yahooClaimsRun(aggregatedAt),
          yahooAdOthersRun(),
          qoo10AdSmartSaleRun(aggregatedAt),
          qoo10AdCartDiscountRun(aggregatedAt),
          qoo10AdPromotionRun(aggregatedAt),
          qoo10AdOthersRun(),
        ]);
        break;
    }
  });

export const advertisingFeeOnCall = runTime.https.onCall(
  async (data: { params: Params }) => {
    console.log(`on call ${topics.batch.advertisingFee}`);

    const params = data?.params;
    const aggregatedAt = params?.aggregatedAt;
    const adType = params?.adType;

    const pubsub = new PubSub();
    await pubsub.topic(topics.batch.advertisingFee).publishMessage({
      json: { params: { aggregatedAt, adType } },
    });
  }
);
