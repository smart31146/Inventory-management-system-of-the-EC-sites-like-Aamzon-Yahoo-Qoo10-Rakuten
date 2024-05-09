import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IYahooItemMatch,
  IYahooItemMatchDocument,
  IYahooItemMatchCsvRow,
} from './schema';
import { subDays } from 'date-fns';

//-------------------------------------------------------------------------------
/**
 * Yahoo：アイテムマッチのコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooItemMatchConverter implements FirestoreDataConverter<IYahooItemMatch>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity データ
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooItemMatch): IYahooItemMatchDocument 
  {
    return {
      date: entity.date,
      storeAccount: entity.storeAccount,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooItemMatchDocument> ): IYahooItemMatch 
  {
    const data = snapshot.data();
    return {
      date: data.date,
      storeAccount: data.storeAccount,
      productCode: data.productCode,
      amount: data.amount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 商品コードは'ストアアカウント' + '_' + '商品コード'の形式であるため、
   *    'ストアアカウント_'を取り除いた商品コードを返す
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IYahooItemMatchCsvRow, today: Date): IYahooItemMatch 
  {
    const yesterday = subDays(today, 1);
    return {
      date: yesterday.getTime(),
      storeAccount: row['ストアアカウント'],
      productCode: row['商品コード'].substring(
        row['ストアアカウント'].length + 1
      ),
      amount: Number(row['利用金額']),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
