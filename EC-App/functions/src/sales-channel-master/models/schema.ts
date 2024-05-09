import { DocumentData } from 'firebase-admin/firestore';

export interface ISalesChannelMasterDocument extends DocumentData {
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元名
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface ISalesChannelMaster {
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元名
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface ISalesChannelMasterSheetRow {
  販売元コード: string;
  販売元名: string;
}
