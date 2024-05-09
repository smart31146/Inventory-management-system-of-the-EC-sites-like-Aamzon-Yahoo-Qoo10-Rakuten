import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IAmazonOrder } from './schema';
import { AmazonOrderConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'amazon-orders';

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文データのrepository
 */
//-------------------------------------------------------------------------------
export class AmazonOrderRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: AmazonOrderConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
    // 変数にFirestore情報を設定
    this.db = getFirestore();

    // コンバータの取得
    this.converter = new AmazonOrderConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { orderId: string }): Promise<IAmazonOrder> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('AmazonOrder: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * irestoreからID指定した全データ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(): Promise<IAmazonOrder[]> 
  {
    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .orderBy('updatedAt', 'desc')
      .get();

    // 取得データを返却
    return snapshot.docs.map((doc) => doc.data());
  }


  //-------------------------------------------------------------------------------
  /**
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - レコード挿入時の重複チェックは行わない
   *   - データ参照時に重複がある場合、更新日が最新のものを正とみなす実装を行う
   *   - 影響範囲：getOne
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IAmazonOrder[]) 
  {
    // 一度の実行できる最大件数
    // Firestoreのバッチは一度に500件までのため
    const limit = 500;

    // Firestoreバッチの一度に実行できるように配列をチャンク分割して繰り返す
    for (const chunkedData of chunk(data, limit)) 
    {
      // Firestoreバッチの取得
      const batch = this.db.batch();

      // ドキュメント設定
      const ref = this.db
        .collection(collectionPath)
        .withConverter(this.converter);

      // チャックの数だけ繰り返してバッチに設置
      chunkedData.forEach((d) => {
        const doc = ref.doc();
        batch.set(doc, d);
      });

      // バッチのコミット
      await batch.commit();
    }
  }
}
