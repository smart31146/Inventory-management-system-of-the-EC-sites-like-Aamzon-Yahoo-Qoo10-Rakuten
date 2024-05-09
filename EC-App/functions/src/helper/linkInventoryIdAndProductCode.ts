import { IFinalizedShipping } from "../finalized-shipping/models/schema";

interface IOrder {
  orderId: string;
  orderedAt: number;
  productCode: string;
}

type FinalizedShippingSummary = {
  lineItems: {
    inventoryId: string;
    finalizedAt: number;
  }[];
};

type OrderSummary = {
  orderedAt: number;
  lineItems: { productCode: string }[];
};

/**
 * finalizeShippingのinventoryIdとorderのproductCodeの対応関係を特定する
 * @param finalizedShippings
 * @param orders
 */
export const linkInventoryIdAndProductCode = (
  finalizedShippings: IFinalizedShipping[],
  orders: IOrder[]
): { inventoryId: string; productCode: string }[] => {
  const fsSummary: { [orderId: string]: FinalizedShippingSummary } = {};
  const orderSummary: { [orderId: string]: OrderSummary } = {};
  const result: { inventoryId: string; productCode: string }[] = [];

  finalizedShippings.forEach((f) => {
    const lineItem = {
      inventoryId: f.inventoryId,
      finalizedAt: f.finalizedAt,
    };

    if (fsSummary[f.orderId]) {
      fsSummary[f.orderId].lineItems.push(lineItem);
    } else {
      fsSummary[f.orderId] = { lineItems: [lineItem] };
    }
  });

  orders.forEach((o) => {
    const lineItem = { productCode: o.productCode };

    if (orderSummary[o.orderId]) {
      orderSummary[o.orderId].lineItems.push(lineItem);
    } else {
      orderSummary[o.orderId] = {
        orderedAt: o.orderedAt,
        lineItems: [lineItem],
      };
    }
  });

  /**
   * fsSummaryのlineItemsが単一の場合、同じorderIdのorderSummaryのlineItemsのproductCodeをfsSummaryのlineItemsのinventoryIdに紐づける
   */
  Object.entries(fsSummary).forEach(([orderId, s]) => {
    if (s.lineItems.length === 1) {
      const productCode = orderSummary[orderId].lineItems[0].productCode;
      result.push({
        inventoryId: s.lineItems[0].inventoryId,
        productCode,
      });
    }
  });

  return result;
};
