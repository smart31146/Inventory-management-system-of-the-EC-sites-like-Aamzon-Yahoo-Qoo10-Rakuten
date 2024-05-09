import { IYahooOrder } from '../../order/models/schema';
import { IYahooAdvertisingFee, AdType } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 特定の商品（商品コード）にその日（注文日）にどれだけ広告宣伝費がかかったか計算する
 * 計算式: 広告宣伝費の合計 / 商品販売数量合計
 * @param orders
 * @param advertisingFees
 * @returns
 */
//-------------------------------------------------------------------------------
export const aggregateAdvertisingFees = ( orders: IYahooOrder[], advertisingFees: IYahooAdvertisingFee[] ): IYahooAdvertisingFee[] => {

  // 注文日+商品コードでユニークになるように集計
  const intermediate: {
    [orderedAt_productCode: string]: {
      orderedAt: number;
      productCode: string;
      quantityTotal: number; // 商品販売数量合計
      advertisingFee: number; // 広告宣伝費の合計
    };
  } = {};

  // ユニークキーを作成
  const uniqueKey = (orderedAt: number, productCode: string) =>
    `${orderedAt}_${productCode}`;

  // 注文データの数だけ繰り返す
  orders.forEach((o) => {

    // ユニークキーからキー作成
    const orderedAt = o.orderedAt;
    const key = uniqueKey(orderedAt, o.productCode);

    // 指定した集計データが存在するか判定
    if (intermediate[key]) 
    {
      // データが存在する場合
      // 数量合計に数量を加算
      intermediate[key].quantityTotal += o.quantity;
    } 
    else 
    {
      // データが存在しない場合
      // 集計データにデータを設定
      intermediate[key] = {
        productCode: o.productCode, // 商品コード
        orderedAt, // 注文日
        quantityTotal: o.quantity, // 特定の注文日における同一商品コードの商品販売数量合計
        advertisingFee: advertisingFees.filter((ad) => ad.date === orderedAt && ad.productCode === o.productCode && ad.type !== '広告宣伝費').reduce(
          (acc, cur) => acc + cur.amount,
          0
        )
      };
    }
  });

  // 広告料金の集約
  const aggregatedAdvertisingFees = Object.values(intermediate).map(
    (values) => {
      return {
        date: values.orderedAt,
        productCode: values.productCode,
        amount: values.advertisingFee / values.quantityTotal,
        type: '広告宣伝費' as AdType,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
    }
  );

  // 集約した広告料金を返却
  return aggregatedAdvertisingFees;
};
