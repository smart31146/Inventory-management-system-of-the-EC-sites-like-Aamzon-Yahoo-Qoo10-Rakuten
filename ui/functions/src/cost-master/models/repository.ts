import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { ICostMaster } from './schema';
import { CostMasterConverter } from './converter';

export const collectionPath = 'cost-master';

//---------------------------------------------------------------------------------
/**
 * 原価マスタのrepositoryクラス
 */
//---------------------------------------------------------------------------------
export class CostMasterRepository {
  private readonly db: Firestore;
  private readonly converter: CostMasterConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() {
    this.db = getFirestore();
    this.converter = new CostMasterConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(): Promise<ICostMaster[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
  public async getOne(query: { leoId: string }): Promise<ICostMaster | undefined> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('leoId', '==', query.leoId)
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
  public async createOrUpdate(data: ICostMaster): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('leoId', '==', data.leoId)
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
  public async batchCreate(
    data: ICostMaster[]
  ): Promise<PromiseSettledResult<void>[]> {
    const results = await Promise.allSettled(
      data.map(async (d) => await this.createOrUpdate(d))
    );

    return results;
  }
}
