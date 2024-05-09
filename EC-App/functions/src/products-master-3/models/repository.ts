import { Firestore, getFirestore } from "firebase-admin/firestore";
import { IProductMaster3 } from "./schema";
import { ProductMaster3Converter } from "./converter";
import { chunk } from "../../helper/chunk";

/**Firestoreのコレクション名：商品マスタ */
export const collectionPath = "products-master-3";

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタのrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class ProductMaster3Repository {
  private readonly db: Firestore;
  private readonly converter: ProductMaster3Converter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() {
    this.db = getFirestore();
    this.converter = new ProductMaster3Converter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(): Promise<IProductMaster3[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ追加 or 更新
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async createOrUpdate(data: IProductMaster3): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where("sku", "==", data.sku)
      .get();

    const isExists = querySnapshot.size > 0;

    if (!isExists) {
      await this.db
        .collection(collectionPath)
        .withConverter(this.converter)
        .doc()
        .create(data);
    } else {
      await querySnapshot.docs[0].ref.update(data);
    }
  }

  //-------------------------------------------------------------------------------
  /**
   * バッチ作成
   * @param data 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate( data: IProductMaster3[] ): Promise<PromiseSettledResult<void>[]> {
    const results = await Promise.allSettled(
      data.map(async (d) => await this.createOrUpdate(d))
    );

    return results;
  }
}
