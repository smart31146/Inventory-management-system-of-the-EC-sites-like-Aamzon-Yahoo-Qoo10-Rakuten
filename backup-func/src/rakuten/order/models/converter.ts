import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IRakutenOrder,
  IRakutenOrderCsvRow,
  IRakutenOrderDocument
} from './schema';
import { parse } from 'date-fns';
import { ja } from 'date-fns/locale';
  
  //-------------------------------------------------------------------------------
  /**
   * 楽天：注文データのコンバーター
   */
  //-------------------------------------------------------------------------------
  export class RakutenOrderConverter implements FirestoreDataConverter<IRakutenOrder>
  {
    //-------------------------------------------------------------------------------
    /**
     * Firestoreへのデータ設定
     * @param entity 
     * @returns 
     */
    //-------------------------------------------------------------------------------
    toFirestore(entity: IRakutenOrder): IRakutenOrderDocument
    {
      return {
        // 注文番号
        // 注文日
        // 商品管理番号
        // 商品合計金額
        // 単価
        // 個数
        // 店舗発行クーポン利用額
        // ポイント倍率
        // クーポン利用額
        orderId: entity.orderId,
        orderedAt: entity.orderedAt,
        productControlCode: entity.productControlCode,
        subTotal: entity.subTotal,
        productUnitPrice: entity.productUnitPrice,
        quantity: entity.quantity,
        storeCouponAmount: entity.storeCouponAmount,
        pointRate: entity.pointRate,
        pointAmount: entity.pointAmount,
        // 作成日 UnixTime
        // 更新日 UnixTime
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    }
  
    //-------------------------------------------------------------------------------
    /**
     * Firestoreのデータ取得
     * @param snapshot 
     * @returns 
     */
    //-------------------------------------------------------------------------------
    fromFirestore( snapshot: QueryDocumentSnapshot<IRakutenOrderDocument> ): IRakutenOrder
    {
      const data = snapshot.data();
      return {
        // 注文番号
        // 注文日
        // 商品管理番号
        // 商品合計金額
        // 単価
        // 個数
        // 店舗発行クーポン利用額
        // ポイント倍率
        // クーポン利用額
        orderId: data.orderId,
        orderedAt: data.orderedAt,
        productControlCode: data.productControlCode,
        subTotal: data.subTotal,
        productUnitPrice: data.productUnitPrice,
        quantity: data.quantity,
        storeCouponAmount: data.storeCouponAmount,
        pointRate: data.pointRate,
        pointAmount: data.pointAmount,
        // 作成日 UnixTime
        // 更新日 UnixTime
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  
    //-------------------------------------------------------------------------------
    /**
     * CSVデータからの取得
     * @param row 
     * @returns 
     */
    //-------------------------------------------------------------------------------
    fromCsvRow( row: IRakutenOrderCsvRow ): IRakutenOrder
    {
      return {
        // 注文番号
        // 注文日
        // 商品管理番号
        // 商品合計金額
        // 単価
        // 個数
        // 店舗発行クーポン利用額
        // ポイント倍率
        // クーポン利用額
        orderId: row["注文番号"] ||'',
        orderedAt: parse(row["注文日"], "MM/dd/yyyy", new Date(), {locale: ja}).getTime() || 0,
        productControlCode: row["商品管理番号"] || '',
        subTotal: Number(row["商品合計金額"]) || 0,
        productUnitPrice: Number(row["単価"]) || 0,
        quantity: Number(row["個数"]) || 0,
        storeCouponAmount: Number(row["店舗発行クーポン利用額"]) || 0,
        pointRate: Number(row["ポイント倍率"]) || 0,
        pointAmount: Number(row["ポイント利用額"]) || 0,
        // 作成日 UnixTime
        // 更新日 UnixTime
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
    }
  }
  