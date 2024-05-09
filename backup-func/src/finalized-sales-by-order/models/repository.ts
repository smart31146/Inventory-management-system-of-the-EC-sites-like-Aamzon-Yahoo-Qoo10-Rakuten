import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IFinalizedSalesByOrder } from './schema';
import { FinalizedSalesByOrderConverter } from './converter';
import { chunk } from '../../helper/chunk';

export const collectionPath = 'finalized-sales-by-order';

export class FinalizedSalesByOrderRepository {
  private readonly db: Firestore;
  private readonly converter: FinalizedSalesByOrderConverter;

  constructor(db?: Firestore) {
    this.db = db ?? getFirestore();
    this.converter = new FinalizedSalesByOrderConverter();
  }

  public async getAll(query: {
    date: number;
  }): Promise<IFinalizedSalesByOrder[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('finalizedAt', '==', query.date)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * レコードの一括挿入（batchCreate）時に重複を許容しているため、
   * 重複レコードがある場合は更新日が直近のものを正とする
   */
  public async getOne(query: {
    leoId: string;
    inventoryId: string;
  }): Promise<IFinalizedSalesByOrder> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('leoId', '==', query.leoId)
      .where('inventoryId', '==', query.inventoryId)
      .orderBy('updatedAt', 'desc')
      .get();

    const isExists = querySnapshot.size > 0;

    if (!isExists) {
      throw new Error('RakutenAd: Document not found');
    }

    return querySnapshot.docs[0].data();
  }

  public async create(data: IFinalizedSalesByOrder): Promise<void> {
    try {
      await this.getOne(data);
      throw new Error('RakutenAd: Document already exists');
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
   * レコードの一括挿入（batchCreate）時に重複を許容しているため、
   * 重複レコードがある場合は更新日が直近のものを正とする
   */
  public async update(data: Partial<IFinalizedSalesByOrder>): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('leoId', '==', data.leoId)
      .where('inventoryId', '==', data.inventoryId)
      .orderBy('updatedAt', 'desc')
      .get();

    const doc = querySnapshot.docs[0];

    if (typeof doc === 'undefined' || !doc.exists) {
      throw new Error('RakutenAd: Document not found');
    }

    await doc.ref.withConverter(this.converter).update(data);
  }

  /**
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - レコード挿入時の重複チェックは行わない
   *   - データ参照時に重複がある場合、更新日が最新のものを正とみなす実装を行う
   *   - 影響範囲：getOne, update
   */
  public async batchCreate(data: IFinalizedSalesByOrder[]) {
    const limit = 500;

    for (const chunkedData of chunk(data, limit)) {
      const batch = this.db.batch();
      const ref = this.db
        .collection(collectionPath)
        .withConverter(this.converter);

      chunkedData.forEach((d) => {
        const doc = ref.doc(d.salesChannel +"_" +d.leoId + "_" + d.finalizedAt);
        batch.set(doc, d);
      });

      await batch.commit();
    }
  }
}
