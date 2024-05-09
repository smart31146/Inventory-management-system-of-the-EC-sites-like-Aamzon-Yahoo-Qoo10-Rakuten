import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  ICostMaster,
  ICostMasterDocument,
  ICostMasterSheetRow,
} from './schema';
import { ParsePrice } from '../../helper/valuePerse';

//-------------------------------------------------------------------------------
/**
 * 原価マスタのコンバーター
 */
//-------------------------------------------------------------------------------
export class CostMasterConverter
  implements FirestoreDataConverter<ICostMaster>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのでーた設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: ICostMaster): ICostMasterDocument {
    return {
      brandName: entity.brandName,
      leoId: entity.leoId,
      productName: entity.productName,
      companyName: entity.companyName,
      costPrice: entity.costPrice,
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
    snapshot: QueryDocumentSnapshot<ICostMasterDocument>
  ): ICostMaster {
    const data = snapshot.data();
    return {
      brandName: data.brandName,
      leoId: data.leoId,
      productName: data.productName,
      companyName: data.companyName,
      costPrice: data.costPrice,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * スプシからデータ取得
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: ICostMasterSheetRow): ICostMaster {
    const costPrice = row['原価'] ? ParsePrice(row['原価']) : 0;
    return {
      brandName: row['ブランド'] || '',
      leoId: row['在庫ID'] || "",
      productName: row['製品名（修正後）'] || '',
      companyName: row['所属企業'] || '',
      costPrice: costPrice,
      createdAt: new Date().getTime() || 0,
      updatedAt: new Date().getTime() || 0,
    };
  }
}
