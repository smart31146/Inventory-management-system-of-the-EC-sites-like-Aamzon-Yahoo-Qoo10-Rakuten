//import { IRakutenOrder } from '../../order/models/schema';
//import { IRakutenAdvertisingFee, RakutenAdType } from '../models/schema';

import { IAmazonOrder } from '../../order/models/schema';
import { IAmazonAdvertisingFee, AdType } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 広告料金の総額
 *  - 特定の商品（商品管理番号）にその日（注文日）にどれだけ広告宣伝費がかかったか計算する
 *  - 計算式: 広告宣伝費の合計 / 商品販売数量合計
 * 
 * @param orders
 * @param advertisingFees
 * @returns
 */
//-------------------------------------------------------------------------------
export const aggregateAdvertisingFees = ( orders: IAmazonOrder[], advertisingFees: IAmazonAdvertisingFee[] ): IAmazonAdvertisingFee[] => {

  // 注文日+商品管理番号でユニークになるように集計
  const intermediate: {
    [orderedAt_productControlCode: string]: {
      orderedAt: number;      // 注文日
      asin: string;           // asin
      quantityTotal: number;  // 商品販売数量合計
      advertisingFee: number; // 広告宣伝費の合計
      type: AdType;           // 種類
      campaign: string;       // キャンペーン
    };
  } = {};

  // ユニークキーを作成
  const uniqueKey = (orderedAt: number, productControlCode: string) =>
    `${orderedAt}_${productControlCode}`;

  // 注文データの数だけ繰り返す
  orders.forEach((o) => {

    // ユニークキーからキー作成
    const orderedAt = o.orderedAt;
    const key = uniqueKey(orderedAt, o.orderId);

    // 指定した集計データが存在するか判定
    if (intermediate[key]) 
    {
      // データが存在する場合
      // 数量合計に数量を加算
      intermediate[key].quantityTotal += o.itemPromotionDiscount;
    } 
    else 
    {
      // データが存在しない場合
      // 集計データにデータを設定
      intermediate[key] = {
        orderedAt: o.orderedAt, // 注文日
        asin: o.orderId,        // asin
        quantityTotal: o.itemPromotionDiscount, // 特定の注文日における同一商品管理番号の商品販売数量合計
        advertisingFee: 0,
        type: '' as AdType,
        campaign: '',
      };
    }
  });

  // 広告料金の作成
  // 広告料金は「SP広告費、SB広告費、SD広告費、その他広告費」の合計値となる
  // keyは注文日＋asinで構成する
  advertisingFees.forEach((f) => {
    const key = uniqueKey(f.date, f.asin);
    intermediate[key].advertisingFee += f.amount;
  });

  // 広告料金の集約
  const aggregatedAdvertisingFees = Object.values(intermediate).map(
    (values) => {
      return {
        date: values.orderedAt,
        asin: values.asin,
        amount: values.advertisingFee / values.quantityTotal,
        type: values.type as AdType,
        campaign: values.campaign,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
    }
  );

  // 集約した広告料金を返却
  return aggregatedAdvertisingFees;
};
