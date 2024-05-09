import { Firestore, getFirestore } from "firebase-admin/firestore";
import { IProductMaster2, SalesChannelMap } from "./schema";
import { ProductMaster2Converter } from "./converter";
import { chunk } from "../../helper/chunk";

/**Firestoreのコレクション名：商品マスタ */
export const collectionPath = "products-master-2";

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタのrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class ProductMaster2Repository {
  private readonly db: Firestore;
  private readonly converter: ProductMaster2Converter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() {
    this.db = getFirestore();
    this.converter = new ProductMaster2Converter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(): Promise<IProductMaster2[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { inventoryId: string, salesChannel: string }): Promise<IProductMaster2 | undefined> 
  {
    const salesChannel = SalesChannelMap[query.salesChannel] || "";
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('inventoryId', '==', query.inventoryId)
      .where("salesChannel", "==" , salesChannel)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // undefinedを返却
     return undefined
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }



  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ追加 or 更新
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async createOrUpdate(data: IProductMaster2): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where("inventoryId", "==", data.inventoryId)
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
  public async batchCreate( data: IProductMaster2[] ): Promise<PromiseSettledResult<void>[]> {
    const results = await Promise.allSettled(
      data.map(async (d) => await this.createOrUpdate(d))
    );

    return results;
  }
}
