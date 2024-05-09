import { IQoo10Order } from '../../order/models/schema';
import { IQoo10AdvertisingFee, AdType } from '../models/schema';

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
export const aggregateAdvertisingFees = ( orders: IQoo10Order[], advertisingFees: IQoo10AdvertisingFee[] ): IQoo10AdvertisingFee[] => {

  // 注文日+商品管理番号でユニークになるように集計
  const intermediate: {
    [orderedAt_productControlCode: string]: {
      orderedAt: number;      // 注文日
      productCode: string;    // 商品コード
      quantityTotal: number;  // 商品販売数量合計
      advertisingFee: number; // 広告宣伝費の合計
      type: AdType;           // 種類
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
      intermediate[key].quantityTotal += o.storeDiscountAmount;
    } 
    else 
    {
      // データが存在しない場合
      // 集計データにデータを設定
      intermediate[key] = {
        orderedAt: o.orderedAt,                // 注文日
        productCode: o.orderId,                // asin
        quantityTotal:  o.storeDiscountAmount, // 特定の注文日における同一商品管理番号の商品販売数量合計
        advertisingFee: 0,                     // 
        type: '' as AdType,                    // 
      };
    }
  });

  // 広告料金の作成
  // 広告料金は
  //「プレミアムタイムセール枠広告費、共同購入広告費、プラス展示広告費、
  //  パワーランクアップ広告費、パワーランクアップ広告費、スマートセールス広告費、
  //  おまけ分原価、その他広告費」の合計値となる
  // keyは注文日＋asinで構成する
  advertisingFees.forEach((f) => {
    const key = uniqueKey(f.date, f.productCode);
    intermediate[key].advertisingFee += f.amount;
  });
  
  // 広告料金の集約
  const aggregatedAdvertisingFees = Object.values(intermediate).map(
    (values) => {
      return {
        date: values.orderedAt,
        productCode: values.productCode,
        amount: values.advertisingFee / values.quantityTotal,
        type: values.type as AdType,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
    }
  );

  // 集約した広告料金を返却
  return aggregatedAdvertisingFees;
};
