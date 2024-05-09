import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IYahooOrder, IYahooOrderDocument, IYahooOrderCsvRow } from './schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文データのコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooOrderConverter implements FirestoreDataConverter<IYahooOrder>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooOrder): IYahooOrderDocument 
  {
    return {
      // Id
      // 注文ID
      // LineID
      // アイテムID
      // 量
      // クーポン割引
      Id: entity.Id,
      orderId: entity.orderId,
      orderedAt: entity.orderedAt,
      lineId: entity.lineId,
      productCode: entity.productCode,
      productName: entity.productName,
      productUnitPrice: entity.productUnitPrice,
      quantity: entity.quantity,
      subTotal: entity.subTotal,
      couponDiscount: entity.couponDiscount,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IYahooOrderDocument>): IYahooOrder 
  {
    const data = snapshot.data();
    return {
      // Id
      // 注文ID
      // LineID
      // アイテムID
      // 量
      // クーポン割引
      Id: data.Id,
      orderId: data.orderId,
      orderedAt: data.orderedAt,
      lineId: data.lineId,
      productCode: data.productCode,
      productName: data.productName,
      productUnitPrice: data.productUnitPrice,
      quantity: data.quantity,
      subTotal: data.subTotal,
      couponDiscount: data.couponDiscount,
      // 作成日 UnixTime
      // 更新日 UnixTime
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   * @param aggregatedDate 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IYahooOrderCsvRow): IYahooOrder 
  {
    return {
      // Id
      // 注文ID
      // LineID
      // アイテムID
      // 量
      // クーポン割引
      Id: row.Id || '',
      orderId: row.OrderId || '',
      orderedAt: new Date(row.LeadTimeStart).getTime() || 0,
      lineId: row.LineId || '',
      productCode: row.ItemId || '',
      productName: row.Title || '',
      productUnitPrice: Number(row.UnitPrice) || 0,
      quantity: Number(row.Quantity) || 0,
      subTotal: Number(row.LineSubTotal) || 0,
      couponDiscount: Number(row.CouponDiscount) || 0,
      // 作成日 UnixTime
      // 更新日 UnixTime
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
