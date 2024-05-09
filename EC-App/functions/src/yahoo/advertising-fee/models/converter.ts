import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  AdType,
  IYahooAdvertisingFee,
  IYahooAdvertisingFeeDocument,
  IYahooAdvertisingFeeSheetRow,
} from './schema';
import { IYahooItemMatch } from '../../ad-item-match/models/schema';
import { IYahooMakerItemMatch } from '../../ad-maker-item-match/models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費のコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooAdvertisingFeeConverter implements FirestoreDataConverter<IYahooAdvertisingFee>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooAdvertisingFee): IYahooAdvertisingFeeDocument {
    return {
      date: entity.date,
      productCode: entity.productCode,
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
  fromFirestore(
    snapshot: QueryDocumentSnapshot<IYahooAdvertisingFeeDocument>
  ): IYahooAdvertisingFee {
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

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IYahooAdvertisingFeeSheetRow): IYahooAdvertisingFee {
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
   * Yahooアイテムマッチ広告費からのデータ取得
   * @param campaign 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromItemMatch(itemMatch: IYahooItemMatch): IYahooAdvertisingFee {
    return {
      date: itemMatch.date,
      productCode: itemMatch.productCode,
      amount: itemMatch.amount,
      type: "アイテムマッチ広告費",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Yahooメーカーアイテムマッチからのデータ取得
   * @param campaign 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromMakerItemMatch(makerItemMatch: IYahooMakerItemMatch, productCode: string): IYahooAdvertisingFee {
    return {
      date: makerItemMatch.date,
      productCode: productCode,
      amount: makerItemMatch.amount,
      type: "メーカーアイテムマッチ",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
