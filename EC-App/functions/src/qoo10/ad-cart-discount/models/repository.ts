import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IQoo10AdCartDiscount } from './schema';
import { Qoo10AdCartDiscountConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'qoo10-ad-cart-discount';

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引のrepository
 */
//-------------------------------------------------------------------------------
export class Qoo10AdCartDiscountRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: Qoo10AdCartDiscountConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
    // 変数にFirestore情報を設定
    // コンバータの取得
    this.db = getFirestore();
    this.converter = new Qoo10AdCartDiscountConverter();
  }

  public async getAll(): Promise<IQoo10AdCartDiscount[]> 
  {
    // クエリー情報がある場合
    // 条件ありでFirestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .orderBy('updatedAt', 'desc')
      .get();

    // 取得したコレクションからデータを取得して返却
    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *     重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { orderId: string; }): Promise<IQoo10AdCartDiscount> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('Qoo10AdCartDiscount: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * バッチ作成
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - レコード挿入時の重複チェックは行わない
   *   - データ参照時に重複がある場合、更新日が最新のものを正とみなす実装を行う
   *   - 影響範囲：getOne
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IQoo10AdCartDiscount[]) 
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
