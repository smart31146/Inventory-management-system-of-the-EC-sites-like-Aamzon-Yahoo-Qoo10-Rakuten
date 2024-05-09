import { mathRound } from '../../../helper/mathRound';
import { IRakutenOrder } from '../../order/models/schema';
import { IRakutenAdvertisingFee, RakutenAdType } from '../models/schema';

/**
 * 特定の商品（商品管理番号）にその日（注文日）にどれだけ広告宣伝費がかかったか計算する
 * 計算式: 広告宣伝費の合計 / 商品販売数量合計
 * @param orders
 * @param advertisingFees
 * @returns
 */

export const aggregateAdvertisingFees = (
  orders: IRakutenOrder[],
  advertisingFees: IRakutenAdvertisingFee[]
): (IRakutenAdvertisingFee & { relatedAds: IRakutenAdvertisingFee[] })[] => {
  // 注文日+商品管理番号でユニークになるように集計
  const intermediate: {
    [orderedAt_productControlCode: string]: {
      orderedAt: number;
      productControlCode: string;
      quantityTotal: number; // 商品販売数量合計
      advertisingFee: number; // 広告宣伝費の合計
      relatedAds: IRakutenAdvertisingFee[];
    };
  } = {};

  const uniqueKey = (orderedAt: number, productControlCode: string) =>
    `${orderedAt}_${productControlCode}`;

  orders.forEach((o) => {
    const orderedAt = o.orderedAt;
    const key = uniqueKey(orderedAt, o.productControlCode);

    if (intermediate[key]) {
      intermediate[key].quantityTotal += o.quantity;
    } else {
      intermediate[key] = {
        productControlCode: o.productControlCode, // 商品管理番号
        orderedAt, // 注文日
        quantityTotal: o.quantity, // 特定の注文日における同一商品管理番号の商品販売数量合計
        advertisingFee: 0,
        relatedAds: [],
      };
    }
  });

  advertisingFees.forEach((f) => {
    if (f.type === '広告宣伝費') return;
    const key = uniqueKey(f.date, f.productControlCode);

    if (typeof intermediate[key] === 'undefined') return;

    intermediate[key].advertisingFee += f.amount;
    intermediate[key].relatedAds.push(f);
  });

  const aggregatedAdvertisingFees = Object.values(intermediate).map(
    (values) => {
      return {
        date: values.orderedAt,
        productControlCode: values.productControlCode,
        amount: mathRound(values.advertisingFee / values.quantityTotal),
        type: '広告宣伝費' as RakutenAdType,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        relatedAds: values.relatedAds,
      };
    }
  );

  return aggregatedAdvertisingFees;
};
