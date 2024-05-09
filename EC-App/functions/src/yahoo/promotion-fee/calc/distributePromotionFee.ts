import { IYahooCampaignCapitalRate } from '../../campaign-capital-rate/models/schema';
import { IYahooOrder } from '../../order/models/schema';

type PromotionFee = {
  orderId: string;
  amount: number;
};

type Intermediate = {
  subTotal: number;
  totalQuantity: number; // 同一注文IDに含まれる商品の数量合計
  couponDiscountTotal: number; // 同一注文IDに含まれる商品のクーポン利用額合計
  orderedAt: number;
  lineItems: {
    productCode: string;
    quantity: number;
    unitPrice: number;
  }[];
};

/**
 * 1商品あたりの販売促進費の計算に利用する集計データ
 * @param orders
 * @returns
 */

export const distributePromotionFee = (
  orders: IYahooOrder[],
  campaignCapitalRate: IYahooCampaignCapitalRate
): PromotionFee[] => {
  const intermediate: {
    [orderId: string]: Intermediate;
  } = {};

  orders.forEach((o) => {
    const orderedAt = o.orderedAt;
    const lineItem = {
      productCode: o.productCode,
      quantity: o.quantity,
      unitPrice: o.productUnitPrice,
    };

    if (intermediate[o.orderId]) {
      intermediate[o.orderId].subTotal += o.subTotal;
      intermediate[o.orderId].totalQuantity += o.quantity;
      intermediate[o.orderId].couponDiscountTotal += o.couponDiscount;
      intermediate[o.orderId].lineItems.push(lineItem);
    } else {
      intermediate[o.orderId] = {
        subTotal: o.subTotal,
        totalQuantity: o.quantity,
        couponDiscountTotal: o.couponDiscount,
        orderedAt,
        lineItems: [lineItem],
      };
    }
  });

  const distributed = Object.entries(intermediate).map(([orderId, values]) => {
    return {
      orderId,
      /**
       * 販売促進費 = クーポン利用額合計 + 倍々参加原資
       * - クーポン利用額合計 = クーポン利用額 * 販売数量
       * - 倍々参加原資 = 売上 * 倍々参加原資倍率
       */
      amount:
        (values.couponDiscountTotal +
          (values.subTotal * campaignCapitalRate.value) / 100) /
        values.totalQuantity,
    };
  });

  return distributed;
};
