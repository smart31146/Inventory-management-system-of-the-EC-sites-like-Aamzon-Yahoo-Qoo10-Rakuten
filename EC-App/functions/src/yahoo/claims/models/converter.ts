import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IYahooClaims,
  IYahooClaimsDocument,
  IYahooClaimsCsvRow,
} from './schema';
import { parse } from 'date-fns';
import { parseAsiaTokyoTimeZone } from '../../../helper';

//-------------------------------------------------------------------------------
/**
 * Yahoo：請求明細のコンバーター
 */
//-------------------------------------------------------------------------------
export class YahooClaimsConverter implements FirestoreDataConverter<IYahooClaims>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IYahooClaims): IYahooClaimsDocument 
  {
    return {
      orderId: entity.orderId,
      orderAt: entity.orderAt,
      expenseType: entity.expenseType,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IYahooClaimsDocument> ): IYahooClaims 
  {
    const data = snapshot.data();
    return {
      orderId: data.orderId,
      orderAt: data.orderAt,
      expenseType: data.expenseType,
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
  fromCsvRow(row: IYahooClaimsCsvRow): IYahooClaims 
  {
    return {
      orderId: row['注文ID'] || '',
      orderAt: parseAsiaTokyoTimeZone(parse(row['利用日'], 'yyyy/MM/dd', new Date())).getTime() || 0,
      expenseType: row['利用項目'] || '',
      amount: Number(row['金額（税抜き）']) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
