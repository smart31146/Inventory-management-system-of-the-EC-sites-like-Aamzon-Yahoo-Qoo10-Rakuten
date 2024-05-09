import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IInventoryUnitPrice } from './schema';
import { InventoryUnitPriceConverter } from './converter';
import { chunk } from '../../helper/chunk';

export const collectionPath = 'inventory-unit-price';

export class InventoryUnitPriceRepository {
  private readonly db: Firestore;
  private readonly converter: InventoryUnitPriceConverter;

  constructor() {
    this.db = getFirestore();
    this.converter = new InventoryUnitPriceConverter();
  }

  /**
   * 集計日+在庫IDをドキュメントのIDとする
   * @param data
   * @returns
   */
  private _docId(
    data: Pick<IInventoryUnitPrice, 'aggregatedAt' | 'inventoryId'>
  ): string {
    return `${data.aggregatedAt}_${data.inventoryId}`;
  }

  public async getAll(query: {
    aggregatedAt: number;
  }): Promise<IInventoryUnitPrice[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('aggregatedAt', '==', query.aggregatedAt)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * 重複レコードがある場合は更新日が直近のものを正とする
   */
  public async getOne(query: {
    aggregatedAt: number;
    inventoryId: string;
  }): Promise<IInventoryUnitPrice> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('aggregatedAt', '==', query.aggregatedAt)
      .where('inventoryId', '==', query.inventoryId)
      .orderBy('updatedAt', 'desc')
      .get();

    const isExists = querySnapshot.size > 0;

    if (!isExists) {
      throw new Error('InventoryUnitPrice: Document not found');
    }

    return querySnapshot.docs[0].data();
  }

  public async create(data: IInventoryUnitPrice): Promise<void> {
    try {
      await this.getOne(data);
      throw new Error('InventoryUnitPrice: Document already exists');
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
  public async update(data: Partial<IInventoryUnitPrice>): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('aggregatedAt', '==', data.aggregatedAt)
      .where('inventoryId', '==', data.inventoryId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    const doc = querySnapshot.docs[0];

    if (typeof doc === 'undefined' || !doc.exists) {
      throw new Error('InventoryUnitPrice: Document not found');
    }

    await doc.ref
      .withConverter(this.converter)
      .update({ ...data, updatedAt: Date.now() });
  }

  /**
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - 集計日+在庫IDをドキュメントのIDとすることで一意性を保つ
   */
  public async batchCreate(data: IInventoryUnitPrice[]) {
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
