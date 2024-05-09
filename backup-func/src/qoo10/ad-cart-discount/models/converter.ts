import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IQoo10AdCartDiscount,
  IQoo10AdCartDiscountDocument,
  IQoo10AdCartDiscountCsvRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引のコンバーター
 */
//-------------------------------------------------------------------------------
export class Qoo10AdCartDiscountConverter implements FirestoreDataConverter<IQoo10AdCartDiscount>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IQoo10AdCartDiscount): IQoo10AdCartDiscountDocument 
  {
    return {
      date: entity.date,
      orderId: entity.orderId,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IQoo10AdCartDiscountDocument> ): IQoo10AdCartDiscount 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      orderId: data.orderId,
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
  fromCsvRow(row: IQoo10AdCartDiscountCsvRow): IQoo10AdCartDiscount[] 
  {
    /**
     * 注文番号は複数ある場合があり, その場合は' | ' で連結されているため分割する
     * 例: xxxxxxxx | yyyyyyyy | zzzzzzzz
     */
    const orderIds = row['注文番号'].split(' | ');
    return orderIds.map((orderId) => ({
      orderId: orderId || '',
      date: new Date(row['発生日']).getTime() || 0, 
      amount: ( Number(row['カート割引金額']) / orderIds.length ) || 0, // 割引金額を注文番号の数で按分する
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }));
  }
}
