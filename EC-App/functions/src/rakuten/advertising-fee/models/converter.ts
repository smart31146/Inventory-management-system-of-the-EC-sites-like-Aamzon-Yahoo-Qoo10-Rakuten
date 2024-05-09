import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { IRakutenAdvertisingFee, IRakutenAdvertisingFeeDocument } from './schema';
import { IRakutenAdCa } from '../../ad-ca/models/schema';
import { IRakutenAdRpp } from '../../ad-rpp/models/schema';
import { IRakutenAdTda } from '../../ad-tda/models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費のコンバーター
 */
//-------------------------------------------------------------------------------
export class RakutenAdvertisingFeeConverter implements FirestoreDataConverter<IRakutenAdvertisingFee>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IRakutenAdvertisingFee): IRakutenAdvertisingFeeDocument 
  {
    return {
      date: entity.date,
      productControlCode: entity.productControlCode,
      amount: entity.amount,
      type: entity.type,
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
  fromFirestore(snapshot: QueryDocumentSnapshot<IRakutenAdvertisingFeeDocument>): IRakutenAdvertisingFee 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      productControlCode: data.productControlCode,
      amount: data.amount,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  fromAdCa(ca: IRakutenAdCa): IRakutenAdvertisingFee {
    return {
      date: ca.date,
      productControlCode: ca.productControlCode,
      amount: ca.amount,
      type: 'CA広告費',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }

  fromAdRpp(rpp: IRakutenAdRpp): IRakutenAdvertisingFee {
    return {
      date: rpp.date,
      productControlCode: rpp.productControlCode,
      amount: rpp.amount,
      type: 'RPP広告費',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }

  fromAdTda(
    tda: IRakutenAdTda,
    productControlCode: string
  ): IRakutenAdvertisingFee {
    return {
      date: tda.date,
      productControlCode: productControlCode,
      amount: tda.amount,
      type: 'TDA広告費',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
