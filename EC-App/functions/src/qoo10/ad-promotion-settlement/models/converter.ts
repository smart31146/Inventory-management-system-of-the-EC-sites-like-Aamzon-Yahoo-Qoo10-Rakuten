import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IQoo10AdPromotionSettlement,
  IQoo10AdPromotionSettlementDocument,
  IQoo10AdPromotionSettlementCsvRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：プロモーション精算内訳のコンバーター
 */
//-------------------------------------------------------------------------------
export class Qoo10AdPromotionSettlementConverter implements FirestoreDataConverter<IQoo10AdPromotionSettlement>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore( entity: IQoo10AdPromotionSettlement ): IQoo10AdPromotionSettlementDocument 
  {
    return {
      date: entity.date,
      orderId: entity.orderId,
      productCode: entity.productCode,
      megawariCouponAmount: entity.megawariCouponAmount,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IQoo10AdPromotionSettlementDocument> ): IQoo10AdPromotionSettlement 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      orderId: data.orderId,
      productCode: data.productCode,
      megawariCouponAmount: data.megawariCouponAmount,
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
  fromCsvRow( row: IQoo10AdPromotionSettlementCsvRow ): IQoo10AdPromotionSettlement 
  {
    return {
      orderId: row['注文番号'] || '',
      productCode: row['商品コード'] || '',
      date: new Date(row['購入者の決済日']).getTime() || 0, 
      megawariCouponAmount: Number(row['メガ割引クーポン1/2']) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
