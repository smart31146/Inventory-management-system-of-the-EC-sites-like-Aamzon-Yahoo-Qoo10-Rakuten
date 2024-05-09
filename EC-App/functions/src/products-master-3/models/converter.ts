import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {
  IProductMaster3,
  IProductMaster3Csv,
  IProductMaster3Document,
} from "./schema";

//---------------------------------------------------------------------------------
/**
 * 商品コードマスタのコンバーター
 */
//---------------------------------------------------------------------------------
export class ProductMaster3Converter
  implements FirestoreDataConverter<IProductMaster3>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデー茶設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IProductMaster3): IProductMaster3Document {
    return {
      sku: entity.sku,
      commission: entity.commission,
      shippingPrice: entity.shippingPrice,
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
    snapshot: QueryDocumentSnapshot<IProductMaster3Document>
  ): IProductMaster3 {
    const data = snapshot.data();
    return {
      sku: data.sku,
      commission: data.commission,
      shippingPrice: data.shippingPrice,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * スプシからの取得
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IProductMaster3Csv): IProductMaster3 {
    return {
      sku: row["SKU"] || '',
      commission: row["販売手数料"] || '',
      shippingPrice: row["配送代行手数料"] || '',
      createdAt: new Date().getTime() || 0,
      updatedAt: new Date().getTime() || 0,
    };
  }
}
