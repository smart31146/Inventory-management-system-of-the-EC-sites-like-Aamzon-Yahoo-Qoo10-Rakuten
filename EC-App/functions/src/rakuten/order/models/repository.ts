import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IRakutenOrder } from './schema';
import { RakutenOrderConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'rakuten-orders';

//-------------------------------------------------------------------------------
/**
 * 楽天：注文データのrepository
 */
//-------------------------------------------------------------------------------
export class RakutenOrderRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: RakutenOrderConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor(db?: Firestore) 
  {
    // 変数にFirestore情報を設定
    this.db = db ?? getFirestore();

    // コンバータの取得
    this.converter = new RakutenOrderConverter();
  }

  /**
   * 注文ID+商品管理番号をドキュメントのIDとする
   * @param data
   * @returns
   */
  private _docId(
    data: Pick<IRakutenOrder, "orderId" | "productControlCode">
  ): string {
    return `${data.orderId}_${data.productControlCode}`;
  }
  
  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(query?: { orderId: string; }): Promise<IRakutenOrder[]> 
  {
    // クエリー情報の存在判定
    if (!query) 
    {
      // クエリー情報が存在しない場合
      // 条件なしでFirestoreのコレクションを取得
      const snapshot = await this.db
        .collection(collectionPath)
        .withConverter(this.converter)
        .get();

      // 取得したコレクションからデータを取得して返却
      return snapshot.docs.map((doc) => doc.data());
    }

    // クエリー情報がある場合
    // 条件ありでFirestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .orderBy('updatedAt', 'desc')
      .get();
    // データの存在結果を取得
    const isExists = snapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) {
      // データが存在しない場合
      // undefinedを返却
      throw new Error('RakutenOrder: Document not found');
    }
    // 取得したコレクションからデータを取得して返却
    return snapshot.docs.map((doc) => doc.data());
  }


  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { orderId: string; productControlCode: string; }): Promise<IRakutenOrder | null> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .where('productControlCode', '==', query.productControlCode)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      return null
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreにデータ追加
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async create(data: IRakutenOrder): Promise<void> 
  {
    try 
    {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('RakutenOrder: Document already exists');
    } 
    catch (error) 
    {
      // エラーが投げられた時を正とする
    }

    // Firestoreにデータを追加
    await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .doc()
      .create(data);
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ更新
   */
  //-------------------------------------------------------------------------------
  public async update(data: Partial<IRakutenOrder>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('orderId', '==', data.orderId)
      .where('productControlCode', '==', data.productControlCode)
      .orderBy('updatedAt', 'asc')
      .limit(1)
      .get();

    // ドキュメントの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // ドキュメントの存在判定
    if( isExists )
    {
        // データが存在する場合
        // Firestoreのデータ更新
        const doc = querySnapshot.docs[0];
        await doc.ref.withConverter(this.converter).update(data);
    }
    else
    {
        // データが存在しない場合
        // エラーとして処理する
        throw new Error('Document not found');
    }
  }

  //-------------------------------------------------------------------------------
  /**
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - 注文ID+商品管理番号をドキュメントのIDとすることで一意性を保つ
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IRakutenOrder[]) 
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

      // チャンクの数だけ繰り返してバッチに設置
      chunkedData.forEach((d) => {
        if (this._docId(d).startsWith('_') || this._docId(d).endsWith('_')) {
          // 一意性を担保できないものは処理しない
          return;
        }

        const doc = ref.doc(this._docId(d));
        batch.set(doc, d, { merge: true });
      });

      // バッチのコミット
      await batch.commit();
    }
  }
}
