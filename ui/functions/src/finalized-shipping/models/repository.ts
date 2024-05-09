import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IFinalizedShipping } from './schema';
import { FinalizedShippingConverter } from './converter';
import { chunk } from '../../helper/chunk';
import { SalesChannel } from '../../helper/types';

export const collectionPath = 'finalized-shipping';

export class FinalizedShippingRepository {
  private readonly db: Firestore;
  private readonly converter: FinalizedShippingConverter;

  constructor() {
    this.db = getFirestore();
    this.converter = new FinalizedShippingConverter();
  }

  /**
   * 注文ID+在庫IDをドキュメントのIDとする
   * @param data
   * @returns
   */
  private _docId(
    data: Pick<IFinalizedShipping, 'orderId' | 'inventoryId'>
  ): string {
    return `${data.orderId}_${data.inventoryId}`;
  }

  /**
   * 指定した条件に一致する全データ取得
   * @param query 条件項目
   * @returns 取得データ
   */
  public async getAll(query: { finalizedAt: number; salesChannel?: SalesChannel; }): Promise<IFinalizedShipping[]> 
  {

    //-----------------------------------------
    //
    // データの取得期間の設定
    //
    //-----------------------------------------

    /**
     * データ取得時に出荷確定日を期間で指定する理由
     * 
     *   - データ取得時は引数で指定した出荷確定日から+aした期間のデータを取得する。
     *     引数で指定した出荷確定日のデータを取得する場合、そこから数日後に取り込んだデータとなる為。
     * 
     *   - 仮に1/3を指定した場合、
     *     1/13頃が出荷確定日となっているデータが1/3に取り込みが行われたデータとなる。
     */

    // 出荷確定日の取得期間開始日の設定
    //  - 変数にUnixTimeの出荷確定日の取得期間開始日を設定
    //  - 出荷確定日の取得期間開始日のUnixTimeをDateに変換
    const finalizedAt_sUnixTime = query.finalizedAt
    const date = new Date( finalizedAt_sUnixTime );

    // 出荷確定日の取得期間終了日の設定
    //  - 出荷確定日の取得開始日から+aして取得期間終了日を設定
    //  - 出荷確定日の取得期間終了日をDateからUnixTimeに変換
    date.setDate(date.getDate() + 3);
    const finalizedAt_eUnixTime = date.getTime();

    //-----------------------------------------
    //
    // データ取得（販売チャンネルなしの場合）
    //
    //-----------------------------------------

    // 販売チャンネルの存在判定
    if (typeof query.salesChannel === 'undefined') 
    {
      // 販売チャンネルが存在しない場合
      // 出荷確定日だけを条件にデータ取得を行う
      const snapshot = await this.db
        .collection(collectionPath)
        .withConverter(this.converter)
        .where('finalizedAt', '==', finalizedAt_sUnixTime)
        .get();
        //.where('finalizedAt', '<=', finalizedAt_eUnixTime)
        

      // 取得結果を返却
      return snapshot.docs.map((doc) => doc.data());
    }

    //-----------------------------------------
    //
    // データ取得（販売チャンネルありの場合）
    //
    //-----------------------------------------

    // 販売チャンネルが存在する場合
    // 出荷確定日と販売チャンネルを条件にデータ取得を行う
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('finalizedAt', '==', finalizedAt_sUnixTime)
      .where('salesChannel', '==', query.salesChannel)
      .get();

    // 取得結果を返却
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * 重複レコードがある場合は更新日が直近のものを正とする
   */
  public async getOne(query: {
    orderId?: string;
    inventoryId?: string;
  }): Promise<IFinalizedShipping> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderId', '==', query.orderId)
      .where('inventoryId', '==', query.inventoryId)
      .orderBy('updatedAt', 'desc')
      .get();

    const isExists = querySnapshot.size > 0;

    if (!isExists) {
      throw new Error('Document not found');
    }

    return querySnapshot.docs[0].data();
  }

  public async create(data: IFinalizedShipping): Promise<void> {
    try {
      await this.getOne(data);
      throw new Error('Document already exists');
    } catch (error) {
      // エラーが投げられた時を正とする
    }

    await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .doc()
      .create(data);
  }

  /**
   * 重複レコードがある場合は更新日が直近のものを正とする
   */
  public async update(data: Partial<IFinalizedShipping>): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('orderId', '==', data.orderId)
      .where('inventoryId', '==', data.inventoryId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    const doc = querySnapshot.docs[0];

    if (typeof doc === 'undefined' || !doc.exists) {
      throw new Error('Document not found');
    }

    await doc.ref
      .withConverter(this.converter)
      .update({ ...data, updatedAt: Date.now() });
  }

  /**
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - 注文ID+在庫IDをドキュメントのIDとすることで一意性を保つ
   */
  public async batchCreate(data: IFinalizedShipping[]) {
    const limit = 500;
    for (const chunkedData of chunk(data, limit)) {
      const batch = this.db.batch();
      const ref = this.db
        .collection(collectionPath)
        .withConverter(this.converter);

      chunkedData.forEach((d) => {
        if (this._docId(d).startsWith('_') || this._docId(d).endsWith('_')) {
          return;
        }

        const doc = ref.doc(this._docId(d));
        batch.set(doc, d, { merge: true });
      });

      await batch.commit();
    }
  }
}
