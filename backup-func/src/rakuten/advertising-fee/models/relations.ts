import { IRakutenAdCa } from '../../ad-ca/models/schema';
import { IRakutenAdOthers } from '../../ad-others/models/schema';
import { IRakutenAdRpp } from '../../ad-rpp/models/schema';
import { IRakutenAdTda } from '../../ad-tda/models/schema';
import { IRakutenCampaignIdToProductControlCode } from '../../campaign-id-to-product-control-code/model/schema';
import { RakutenAdvertisingFeeConverter } from './converter';
import { IRakutenAdvertisingFee } from './schema';

export class Relations {
  constructor() {}

  static init(): Relations {
    return new Relations();
  }

  public getAllAdsByDate(
    orderedAt: number,
    adSource: {
      adCa: IRakutenAdCa[];
      adRpp: IRakutenAdRpp[];
      adTda: IRakutenAdTda[];
      campaign: IRakutenCampaignIdToProductControlCode[];
      adOthers: IRakutenAdOthers[];
    }
  ): IRakutenAdvertisingFee[] {
    const converter = new RakutenAdvertisingFeeConverter();

    const adCa = adSource.adCa.filter((i) => i.date === orderedAt).map((ca) =>
      converter.fromAdCa(ca)
    );

    const adRpp = adSource.adRpp.filter((i) => i.date === orderedAt).map((rpp) =>
      converter.fromAdRpp(rpp)
    );

    const adTda = adSource.adTda.filter((i) => i.date === orderedAt);
    const adTdaWithProductControlCode: IRakutenAdvertisingFee[] = adTda.map(
      (tda) => {
        const campaign = adSource.campaign.find(
          (i) => i.campaignId === tda.campaignId
        );
        if (!campaign) {
          throw new Error(`campaign not found. campaignId: ${tda.campaignId}`);
        }

        return converter.fromAdTda(tda, campaign.productControlCode);
      }
    );

    const adOthers = adSource.adOthers.filter((i) => i.date === orderedAt);

    return [...adCa, ...adRpp, ...adTdaWithProductControlCode, ...adOthers];
  }
}
