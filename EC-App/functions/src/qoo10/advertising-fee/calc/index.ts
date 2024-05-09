import { aggregateAdvertisingFees } from './aggregate';
import { Relations } from '../models/relations';
import { IFinalizedShipping } from '../../../finalized-shipping/models/schema';
import { IQoo10Order } from '../../order/models/schema';
import { IQoo10AdSmartSales } from '../../ad-smart-sales/models/schema';
import { IQoo10AdOthers } from '../../ad-others/models/schema';

//-------------------------------------------------------------------------------
/**
 * 広告宣伝費の計算
 * - 1日あたりその商品にどれだけ広告費をかけたかを計算の上、商品数量をかける
 * - 例： 2000/1/1 商品Aに300円の広告費をかけ、1日で商品Aが合計10個売れた場合
 *   - この日の商品A1個あたりの広告宣伝費は300円 / 10個 = 30円
 * 
 * @param orders
 * @param fs
 * @param productControlCode
 * @returns
 */
//-------------------------------------------------------------------------------
export const calcAdvertisingFee = (orders: IQoo10Order[], fs: IFinalizedShipping, productCode: string, adSource: {
  adSmart: IQoo10AdSmartSales[];
  adOthers: IQoo10AdOthers[];
}) => {

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

  // 商品コードが一致するデータだけ取得
  const found = aggregated.find(
    (a) => a.productCode === productCode
  );

  // 広告宣伝費となる金額を返却
  return { amount: (found?.amount ?? 0) * fs.quantity };
};
