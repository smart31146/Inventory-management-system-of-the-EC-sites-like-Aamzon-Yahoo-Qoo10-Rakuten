import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { ISalesChannelMaster } from './schema';
import { SalesChannelMasterConverter } from './converter';

export const collectionPath = 'sales-channel-master';

export class SalesChannelMasterRepository {
  private readonly db: Firestore;
  private readonly converter: SalesChannelMasterConverter;

  constructor() {
    this.db = getFirestore();
    this.converter = new SalesChannelMasterConverter();
  }

  public async getAll(): Promise<ISalesChannelMaster[]> {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  public async createOrUpdate(data: ISalesChannelMaster): Promise<void> {
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('salesChannel', '==', data.salesChannel)
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

  public async batchCreate(
    data: ISalesChannelMaster[]
  ): Promise<PromiseSettledResult<void>[]> {
    const results = await Promise.allSettled(
      data.map(async (d) => await this.createOrUpdate(d))
    );

    return results;
  }
}
