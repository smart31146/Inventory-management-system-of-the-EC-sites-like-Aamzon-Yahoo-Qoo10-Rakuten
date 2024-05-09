import { aggregateAdvertisingFees } from './aggregate';
import { Relations } from '../models/relations';
import { IYahooOrder } from '../../order/models/schema';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { IYahooItemMatch } from '../../ad-item-match/models/schema';
import { IYahooMakerItemMatch } from '../../ad-maker-item-match/models/schema';
import { IYahooCampaignIdToProductCode } from '../../campaign-id-to-product-code/models/schema';
import { IYahooAdOthers } from '../../ad-others/models/schema';

//-------------------------------------------------------------------------------
/**
 * 広告宣伝費
 * - 1日あたりその商品にどれだけ広告費をかけたかを計算の上、商品数量をかける
 * - 例： 2000/1/1 商品Aに300円の広告費をかけ、1日で商品Aが合計10個売れた場合
 *   - この日の商品A1個あたりの広告宣伝費は300円 / 10個 = 30円
 * @param orders
 * @param fs
 * @param productCode
 * @returns
 */
//-------------------------------------------------------------------------------
export const calcAdvertisingFee = (
  orders: IYahooOrder[],
  fs: IFinalizedShipping,
  productCode: string,
  adSource: {
    itemMatch: IYahooItemMatch[];
    makerItemMatch: IYahooMakerItemMatch[];
    campaign: IYahooCampaignIdToProductCode[];
    adOthers: IYahooAdOthers[];
  }
) => {

  // Relationを作成
  const relations = Relations.init();

  // 注文データから注文日を取得
  if(!orders[0]) return {
    amount: 0
  }
  const orderedAt = orders[0].orderedAt;

  // 広告料金の総額を取得
  const allAds = relations.getAllAdsByDate(orderedAt, adSource);
  const aggregated = aggregateAdvertisingFees(orders, allAds);

  // asinが一致するデータだけ取得
  const found = aggregated.find(
    (a) => a.productCode === productCode
  );
  
  // 広告宣伝費となる金額を返却
  return { amount: (found?.amount ?? 0) * fs.quantity };
};
