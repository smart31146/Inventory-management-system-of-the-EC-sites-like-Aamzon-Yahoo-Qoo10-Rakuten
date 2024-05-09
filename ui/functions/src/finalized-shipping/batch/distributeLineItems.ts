import { IFinalizedShipping } from '../models/schema';

type Summary = {
  totalPrice: number;
  totalQuantity: number;
  discount: number;
  shippingFee: number;
  commissionFee: number;
  lineItems: {
    inventoryId: string;
    quantity: number;
    unitPrice: number;
  }[];
};

/**
 * 注文に複数商品が含まれる時、
 * 出荷確定データの売上・送料・手数料（・値引額）は２商品目以降が０円になるため、1商品目の金額を各商品に按分する
 * @param finalizedShippings
 * @returns
 */
export const distributeLineItems = (
  finalizedShippings: IFinalizedShipping[]
): IFinalizedShipping[] => {
  const summaryMap: { [orderId: string]: Summary } = {};

  finalizedShippings.forEach((f) => {
    const lineItem = {
      inventoryId: f.inventoryId,
      quantity: f.quantity,
      unitPrice: f.unitPrice,
    };

    // 単価０の商品は除外（按分しない）
    if (lineItem.unitPrice === 0) return;

    if (summaryMap[f.orderId]) {
      summaryMap[f.orderId].totalPrice += f.totalPrice;
      summaryMap[f.orderId].shippingFee += f.shippingFee;
      summaryMap[f.orderId].commissionFee += f.commissionFee;
      summaryMap[f.orderId].totalQuantity += f.quantity;
      summaryMap[f.orderId].lineItems.push(lineItem);
    } else {
      summaryMap[f.orderId] = {
        totalPrice: f.totalPrice,
        totalQuantity: f.quantity,
        shippingFee: f.shippingFee,
        commissionFee: f.commissionFee,
        discount: 0,
        lineItems: [lineItem],
      };
    }
  });

  Object.entries(summaryMap).forEach(([orderId, f]) => {
    // 商品小計
    const subTotal = f.lineItems.reduce(
      (acc, cur) => (acc += cur.unitPrice * cur.quantity),
      0
    );

    // 値引額 = (商品小計 + 送料 + 手数料) - 値引後合計
    const discount = subTotal + f.shippingFee + f.commissionFee - f.totalPrice;
    summaryMap[orderId].discount = discount;
  });

  return finalizedShippings.map((f) => {
    const order = summaryMap[f.orderId];

    if (typeof order === 'undefined') return { ...f };

    const lineItem = order.lineItems.find(
      (l) => l.inventoryId === f.inventoryId
    );

    if (typeof lineItem === 'undefined') return { ...f };

    // 按分率 = 注文商品数量 / 注文商品数量合計
    const distributionRate = lineItem.quantity / order.totalQuantity;

    const distributedDiscount = order.discount * distributionRate;
    const distributedShippingFee = order.shippingFee * distributionRate;
    const distributedCommissionFee = order.commissionFee * distributionRate;

    // 値引後合計 = (小計 + 送料 + 手数料) - 値引額
    const distributedTotalPrice =
      lineItem.unitPrice * lineItem.quantity +
      distributedShippingFee +
      distributedCommissionFee -
      distributedDiscount;

    return {
      ...f,
      distributedTotalPrice,
      distributedDiscount,
      distributedShippingFee,
      distributedCommissionFee,
      unitPrice: lineItem.unitPrice,
    };
  });
};
