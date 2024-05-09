import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IYahooOrder } from './schema';
import { YahooOrderConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'yahoo-orders';

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文データのrepository
 */
//-------------------------------------------------------------------------------
export class YahooOrderRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: YahooOrderConverter;

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
    this.converter = new YahooOrderConverter();
  }

  public async getAll(): Promise<IYahooOrder[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    return snapshot.docs.map((doc) => doc.data()).sort((a, b) => a.updatedAt - b.updatedAt);
  }

  public async getByOrderId(query: { orderId: string }): Promise<IYahooOrder[]> {
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
    if (!isExists) {
      // データが存在しない場合
      // undefinedを返却
      throw new Error('IYahooOrder: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * 引数で指定したLineIDと同じFirestoreのデータを取得
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *    重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getLineItems(query: {orderId: string;}): Promise<IYahooOrder[]> 
  {
    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .get();

    // Array.prototype.find() は、最初に見つかった要素を返すため
    // 更新日順にソートしてからLineIdの重複を除外する
    const items = snapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.updatedAt - b.updatedAt);

    // Firestoreからの取得値からLineIDだけ格納
    const lineIds = new Set(items.map((item) => item.lineId));

    // 引数で指定したLineIDのデータを格納する変数
    const lineItems: IYahooOrder[] = [];

    // LineIDの数だけ繰り返す
    lineIds.forEach((lineId) => {

      // Firestoreの取得値から引数で指定されたLineIDと同じデータを取得
      const item = items.find((item) => item.lineId === lineId);

      // データの取得判定
      if (item) 
      {
        // 取得データが存在する場合
        // 返却値に取得データを格納
        lineItems.push(item);
      }
    });

    // 取得データを返却
    return lineItems;
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreからデータ取得
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *    重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { orderId: string }): Promise<IYahooOrder> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('productControlCode', '==', query.orderId)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('YahooOrder: Document not found');
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
   *   - 影響範囲：getOne, update
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IYahooOrder[]) 
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
