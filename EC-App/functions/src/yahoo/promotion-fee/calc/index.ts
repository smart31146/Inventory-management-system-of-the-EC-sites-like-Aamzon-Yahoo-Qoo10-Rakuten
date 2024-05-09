import { distributePromotionFee } from './distributePromotionFee';
import { IYahooOrder } from '../../order/models/schema';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { IYahooCampaignCapitalRate } from '../../campaign-capital-rate/models/schema';

/**
 * 販売促進費
 * - その注文においてかかった広告費を一度按分し、商品数量をかける
 * - 例： 商品A x 2個, 商品B x 1個を含む注文Xがあり、注文X全体で300円の広告費がかかった場合
 *   - 商品Aにかかった販売促進費は300円 / 3個 * 2個 = 200円
 *   - 商品Bにかかった販売促進費は300円 / 3個 * 1個 = 100円
 * @param orders
 * @param fs
 * @param campaignCapitalRate
 * @returns
 */
export const calcPromotionFee = (
  orders: IYahooOrder[],
  fs: IFinalizedShipping,
  campaignCapitalRate: IYahooCampaignCapitalRate
) => {
  const distributed = distributePromotionFee(orders, campaignCapitalRate);
  const found = distributed.find((d) => d.orderId === fs.orderId);

  return { amount: (found?.amount ?? 0) * fs.quantity };
};
