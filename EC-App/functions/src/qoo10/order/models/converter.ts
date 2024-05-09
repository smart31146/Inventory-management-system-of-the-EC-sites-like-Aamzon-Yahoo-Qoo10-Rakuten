import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IQoo10Order, IQoo10OrderDocument, IQoo10OrderCsvRow } from './schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：注文データのコンバーター
 */
//-------------------------------------------------------------------------------
export class Qoo10OrderConverter implements FirestoreDataConverter<IQoo10Order>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IQoo10Order): IQoo10OrderDocument 
  {
    return {
      // 注文番号
      // 購入者の決済日
      // 商品コード
      // 販売店舗負担割引金額
      orderId: entity.orderId,
      orderedAt: entity.orderedAt,
      productCode: entity.productCode,
      storeDiscountAmount: entity.storeDiscountAmount,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IQoo10OrderDocument>): IQoo10Order 
  {
    const data = snapshot.data();
    return {
      // 注文番号
      // 購入者の決済日
      // 商品コード
      // 販売店舗負担割引金額
      orderId: data.orderId,
      orderedAt: data.orderedAt,
      productCode: data.productCode,
      storeDiscountAmount: data.storeDiscountAmount,
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
  fromCsvRow(row: IQoo10OrderCsvRow): IQoo10Order 
  {
    return {
      // 注文番号
      // 購入者の決済日
      // 商品コード
      // 販売店舗負担割引金額
      orderId: row['注文番号'] || '',
      orderedAt: new Date(row['購入者の決済日']).getTime() || 0,
      productCode: row['商品コード'] || '',
      storeDiscountAmount: row['販売店舗負担割引金額'] || 0,
      // 作成日 UnixTime
      // 更新日 UnixTime
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
