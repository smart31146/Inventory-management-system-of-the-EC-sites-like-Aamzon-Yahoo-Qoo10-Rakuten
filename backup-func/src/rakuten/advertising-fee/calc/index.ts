import { aggregateAdvertisingFees } from './aggregate';
import { Relations } from '../models/relations';
import { IRakutenOrder } from '../../order/models/schema';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { IRakutenAdCa } from '../../ad-ca/models/schema';
import { IRakutenAdRpp } from '../../ad-rpp/models/schema';
import { IRakutenAdTda } from '../../ad-tda/models/schema';
import { IRakutenCampaignIdToProductControlCode } from '../../campaign-id-to-product-control-code/model/schema';
import { IRakutenAdOthers } from '../../ad-others/models/schema';

/**
 * 広告宣伝費
 * - 1日あたりその商品にどれだけ広告費をかけたかを計算の上、商品数量をかける
 * - 例： 2000/1/1 商品Aに300円の広告費をかけ、1日で商品Aが合計10個売れた場合
 *   - この日の商品A1個あたりの広告宣伝費は300円 / 10個 = 30円
 * @param orders
 * @param fs
 * @param productControlCode
 * @returns
 */
export const calcAdvertisingFee = (
  orders: IRakutenOrder[],
  fs: IFinalizedShipping,
  productControlCode: string,
  adSource: {
    adCa: IRakutenAdCa[];
    adRpp: IRakutenAdRpp[];
    adTda: IRakutenAdTda[];
    campaign: IRakutenCampaignIdToProductControlCode[];
    adOthers: IRakutenAdOthers[];
  }
) => {
  const relations = Relations.init();
  if(!orders[0]) return {
    amount: 0
  }
  const orderedAt = orders[0].orderedAt;

  // TODO: 検索条件に商品コードも含める
  const allAds = relations.getAllAdsByDate(orderedAt, adSource);
  const aggregated = aggregateAdvertisingFees(orders, allAds);

  const found = aggregated.find(
    (a) => a.productControlCode === productControlCode
  );
  return {
    amount: (found?.amount ?? 0) * fs.quantity,
    relatedAds: found?.relatedAds ?? [],
  };
};
