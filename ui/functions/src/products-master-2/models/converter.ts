import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {
  IProductMaster2,
  IProductMaster2Csv,
  IProductMaster2Document,
} from "./schema";

//---------------------------------------------------------------------------------
/**
 * 商品コードマスタのコンバーター
 */
//---------------------------------------------------------------------------------
export class ProductMaster2Converter
  implements FirestoreDataConverter<IProductMaster2>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデー茶設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IProductMaster2): IProductMaster2Document {
    return {
      inventoryId: entity.inventoryId,
      leoId: entity.leoId,
      taxRatio: entity.taxRatio,
      sellingPrice: entity.sellingPrice,
      salesChannel: entity.salesChannel,
      brandName: entity.brandName,
      productName: entity.productName,
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
    snapshot: QueryDocumentSnapshot<IProductMaster2Document>
  ): IProductMaster2 {
    const data = snapshot.data();
    return {
      inventoryId: data.inventoryId,
      leoId: data.leoId,
      taxRatio: data.taxRatio,
      salesChannel: data.salesChannel,
      sellingPrice: data.sellingPrice,
      brandName: data.brandName,
      productName: data.productName,
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
  fromCsvRow(row: IProductMaster2Csv): IProductMaster2 {
    return {
      inventoryId: row["商品コード"] || '',
      leoId: row["対応在庫ID"] || "",
      taxRatio: row["税率区分"] || '',
      sellingPrice: row["通常価格（税込）"] || '',
      salesChannel: row["販売先"] || '',
      productName: row['製品名'] || '',
      brandName: row["ブランド"] || '',
      createdAt: new Date().getTime() || 0,
      updatedAt: new Date().getTime() || 0,
    };
  }
}
