import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
  IQoo10AdvertisingFee,
  IQoo10AdvertisingFeeDocument,
  IQoo10AdvertisingFeeSheetRow,
} from './schema';
import { IQoo10AdSmartSales } from '../../ad-smart-sales/models/schema';

export class Qoo10AdvertisingFeeConverter
  implements FirestoreDataConverter<IQoo10AdvertisingFee>
{
  toFirestore(entity: IQoo10AdvertisingFee): IQoo10AdvertisingFeeDocument {
    return {
      date: entity.date,
      productCode: entity.productCode,
      amount: entity.amount,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<IQoo10AdvertisingFeeDocument>
  ): IQoo10AdvertisingFee {
    const data = snapshot.data();
    return {
      date: data.date,
      productCode: data.productCode,
      amount: data.amount,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  fromCsvRow(row: IQoo10AdvertisingFeeSheetRow): IQoo10AdvertisingFee {
    return {
      date: new Date(row['日付']).getTime(),
      productCode: row['商品コード'],
      amount: Number(row['金額']),
      type: row['広告費種別'] as AdType,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Qoo10スマートセールス広告からのデータ取得
   * @param campaign 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromAdSmart(smart: IQoo10AdSmartSales): IQoo10AdvertisingFee 
  {
    return {
      date: smart.createdAt,
      productCode: smart.productCode,
      amount: smart.amount,
      type: '' as AdType,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
