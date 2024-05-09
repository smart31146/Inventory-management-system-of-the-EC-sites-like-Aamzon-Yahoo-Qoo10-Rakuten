import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IQoo10AdSmartSales,
  IQoo10AdSmartSalesDocument,
  IQoo10AdSmartSalesCsvRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：スマートセールス広告のコンバーター
 */
//-------------------------------------------------------------------------------
export class Qoo10AdSmartSalesConverter implements FirestoreDataConverter<IQoo10AdSmartSales>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IQoo10AdSmartSales): IQoo10AdSmartSalesDocument 
  {
    return {
      date: entity.date,
      orderId: entity.orderId,
      productCode: entity.productCode,
      amount: entity.amount,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IQoo10AdSmartSalesDocument> ): IQoo10AdSmartSales 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      orderId: data.orderId,
      productCode: data.productCode,
      amount: data.amount,
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
  fromCsvRow(row: IQoo10AdSmartSalesCsvRow): IQoo10AdSmartSales 
  {
    return {
      date: new Date(row['購入者の決済日']).getTime() || 0,
      orderId: row['注文番号'] || '',
      productCode: row['商品コード'] || '',
      amount: Number.parseFloat( row['販売金額'] ) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
