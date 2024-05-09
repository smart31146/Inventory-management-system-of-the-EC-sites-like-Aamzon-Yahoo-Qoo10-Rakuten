import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IDivisionCodeMaster,
  IDivisionCodeMasterSheetRow,
  IDivisionCodeMasterDocument,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * 商品マスタのコンバーター
 */
//-------------------------------------------------------------------------------
export class DivisionCodeMasterConverter implements FirestoreDataConverter<IDivisionCodeMaster>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IDivisionCodeMaster): IDivisionCodeMasterDocument {
    return {
      companyCode: entity.companyCode,
      companyName: entity.companyName,
      divisionCode: entity.divisionCode,
      divisionName: entity.divisionName,
      brandName: entity.brandName,
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
  fromFirestore( snapshot: QueryDocumentSnapshot<IDivisionCodeMasterDocument> ): IDivisionCodeMaster {
    const data = snapshot.data();
    return {
      companyCode: data.companyCode,
      companyName: data.companyName,
      divisionCode: data.divisionCode,
      divisionName: data.divisionName,
      brandName: data.brandName,
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
  fromCsvRow(row: IDivisionCodeMasterSheetRow): IDivisionCodeMaster {
    return {
      companyCode: row['企業コード'] || '',
      companyName: row['企業名'] || '',
      divisionCode: row['部門コード'] || '',
      divisionName: row['ブランド名'] || '',
      brandName: row['ブランド'] || '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
