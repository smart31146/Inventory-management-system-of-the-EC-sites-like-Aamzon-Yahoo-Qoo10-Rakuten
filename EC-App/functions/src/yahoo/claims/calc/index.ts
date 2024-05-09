import { IYahooClaims } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 手数料の計算
 * 手数料 = Yahoo!手数料 + 決済手数料 + PRオプション利用料 + プロモーションパッケージ利用料
 * - Yahoo!手数料 = ポイント原資 + キャンペーン原資
 * - 決済手数料 = PRオプション利用料 | ポイント原資 | キャンペーン原資 | プロモーションパッケージ利用料 | Yahoo!ショッピング　トリプル　300MBプラン 以外の合計
 */
//-------------------------------------------------------------------------------
export const calcCommissionFee = (
  claims: IYahooClaims[],
  lineItemQuantity: number,
  lineItemsTotalQuanity: number
): number => {

  // 手数料情報から「Yahoo手数料」を算出
  const yahooCommissionFee = claims
    .filter(
      (c) =>
        c.expenseType === 'ポイント原資' || c.expenseType === 'キャンペーン原資'
    )
    .reduce((acc, cur) => acc + cur.amount, 0);

  // 手数料情報から「お支払い手数料」を算出
  const paymentCommissionFee = claims
    .filter(
      (c) =>
        c.expenseType !== 'PRオプション利用料' &&
        c.expenseType !== 'ポイント原資' &&
        c.expenseType !== 'キャンペーン原資' &&
        c.expenseType !== 'Yahoo!ショッピング　トリプル　300MBプラン' &&
        c.expenseType !== 'プロモーションパッケージ利用料'
    )
    .reduce((acc, cur) => acc + cur.amount, 0);

  // 手数料情報から「オプション料金」を算出
  const prOptionFee = claims
    .filter((c) => c.expenseType === 'PRオプション利用料')
    .reduce((acc, cur) => acc + cur.amount, 0);

  // 手数料情報から「プロモーションパッケージ料金」を算出
  const promotionPackageFee = claims
    .filter((c) => c.expenseType === 'プロモーションパッケージ利用料')
    .reduce((acc, cur) => acc + cur.amount, 0);

  // 注文あたりの手数料
  const commissionFeeByOrder =
    yahooCommissionFee +
    paymentCommissionFee +
    prOptionFee +
    promotionPackageFee;

  // LineItemあたりの手数料 = 手数料 * 注文数量 / 注文数量合計
  const commissionFeeByLineItem =
    (commissionFeeByOrder * lineItemQuantity) / lineItemsTotalQuanity;

  // LineItemあたりの手数料を返却
  return commissionFeeByLineItem;
};
