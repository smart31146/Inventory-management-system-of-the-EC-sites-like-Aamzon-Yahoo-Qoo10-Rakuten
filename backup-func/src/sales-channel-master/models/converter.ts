import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  ISalesChannelMaster,
  ISalesChannelMasterDocument,
  ISalesChannelMasterSheetRow,
} from './schema';

export class SalesChannelMasterConverter
  implements FirestoreDataConverter<ISalesChannelMaster>
{
  toFirestore(entity: ISalesChannelMaster): ISalesChannelMasterDocument {
    return {
      salesChannel: entity.salesChannel,
      salesChannelCode: entity.salesChannelCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<ISalesChannelMasterDocument>
  ): ISalesChannelMaster {
    const data = snapshot.data();
    return {
      salesChannel: data.salesChannel,
      salesChannelCode: data.salesChannelCode,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  fromCsvRow(row: ISalesChannelMasterSheetRow): ISalesChannelMaster {
    return {
      salesChannel: row['販売元名'],
      salesChannelCode: row['販売元コード'],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
