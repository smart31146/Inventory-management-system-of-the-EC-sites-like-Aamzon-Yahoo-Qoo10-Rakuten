import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IRakutenAdRpp } from './schema';
import { RakutenAdRppConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'rakuten-ad-rpp';

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP広告費データのrepository
 */
//-------------------------------------------------------------------------------
export class RakutenAdRppRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: RakutenAdRppConverter;

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
    this.converter = new RakutenAdRppConverter();
  }

  /**
   * 日付+商品管理番号をドキュメントのIDとする
   * @param data
   * @returns
   */
  private _docId(
    data: Pick<IRakutenAdRpp, 'date' | "productControlCode">
  ): string {
    return `${data.date}_${data.productControlCode}`;
  }

  public async getAll(): Promise<IRakutenAdRpp[]> 
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

  public async getByOrderedAt(query: {orderedAt: number}): Promise<IRakutenAdRpp[]>
  {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.orderedAt)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   *  - 重複レコードがある場合は更新日が直近のものを正とする
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: {date: string; productControlCode: string;}): Promise<IRakutenAdRpp> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.date)
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
      // エラーとして処理する
      throw new Error('RakutenAdRpp: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * バッチ作成
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - 日付+商品管理番号をドキュメントのIDとすることで一意性を保つ
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IRakutenAdRpp[]) 
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
