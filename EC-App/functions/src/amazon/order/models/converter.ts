import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IAmazonOrder,
  IAmazonOrderDocument,
  IAmazonOrderCsvRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文データのコンバーター
 */
//-------------------------------------------------------------------------------
export class AmazonOrderConverter implements FirestoreDataConverter<IAmazonOrder>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonOrder): IAmazonOrderDocument 
  {
    return {
      // 注文ID
      // 注文日
      // asin
      // itemPromotionDiscount
      orderId: entity.orderId,
      orderedAt: entity.orderedAt,
      sku: entity.sku,
      itemPromotionDiscount: entity.itemPromotionDiscount,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IAmazonOrderDocument>): IAmazonOrder 
  {
    const data = snapshot.data();
    return {
      // 注文ID
      // 注文日
      // sku
      // itemPromotionDiscount
      orderId: data.orderId,
      orderedAt: data.orderedAt,
      sku: data.sku,
      itemPromotionDiscount: data.itemPromotionDiscount,
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
  fromCsvRow(row: IAmazonOrderCsvRow): IAmazonOrder 
  {
    return {
      // 注文ID
      // 注文日
      // sku
      // itemPromotionDiscount
      orderId: row['amazon-order-id'] || '',
      orderedAt: new Date(row['purchase-date']).getTime() || 0,
      sku: row['sku'] || '',
      itemPromotionDiscount: Number(row['item-promotion-discount']) || 0,
      // 作成日 UnixTime
      // 更新日 UnixTime
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
