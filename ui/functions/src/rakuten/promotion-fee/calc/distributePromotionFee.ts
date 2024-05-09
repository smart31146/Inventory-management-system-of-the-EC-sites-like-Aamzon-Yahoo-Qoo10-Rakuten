import { mathRound } from '../../../helper/mathRound';
import { IRakutenOrder } from '../../order/models/schema';

type PromotionFee = {
  orderId: string;
  amount: number;
};

type Intermediate = {
  subTotal: number;
  totalQuantity: number;
  storeCouponAmountTotal: number;
  pointRate: number;
  orderedAt: number;
  lineItems: {
    productControlCode: string;
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
  orders: IRakutenOrder[]
): (PromotionFee & {
  values: {
    storeCouponAmountTotal: number;
    subTotal: number;
    pointRate: number;
    totalQuantity: number;
    lineItemsLength: number;
  };
})[] => {
  const intermediate: {
    [orderId: string]: Intermediate;
  } = {};

  orders.forEach((o) => {
    const orderedAt = o.orderedAt;
    const lineItem = {
      productControlCode: o.productControlCode,
      quantity: o.quantity,
      unitPrice: o.productUnitPrice,
    };

    if (intermediate[o.orderId]) {
      intermediate[o.orderId].subTotal += o.subTotal || 0;
      intermediate[o.orderId].totalQuantity += o.quantity;
      intermediate[o.orderId].storeCouponAmountTotal += o.storeCouponAmount;
      intermediate[o.orderId].lineItems.push(lineItem);
    } else {
      intermediate[o.orderId] = {
        subTotal: o.subTotal || 0,
        totalQuantity: o.quantity, // 同一注文IDに含まれる商品の数量合計
        storeCouponAmountTotal: o.storeCouponAmount, // 同一注文IDに含まれる商品のクーポン利用額合計
        pointRate: o.pointRate,
        orderedAt, // 注文日
        lineItems: [lineItem],
      };
    }
  });

  const distributed = Object.entries(intermediate).map(([orderId, values]) => {
    return {
      orderId,
      // 販売促進費 = (クーポン利用額 / 1.1) + (売上 * ポイント倍率)
      amount: mathRound(
        (values.storeCouponAmountTotal / 1.1 +
          (values.subTotal * values.pointRate) / 100) /
          values.totalQuantity
      ),
      values: {
        storeCouponAmountTotal: values.storeCouponAmountTotal,
        subTotal: values.subTotal,
        pointRate: values.pointRate,
        totalQuantity: values.totalQuantity,
        lineItemsLength: values.lineItems.length,
      },
    };
  });

  return distributed;
};
