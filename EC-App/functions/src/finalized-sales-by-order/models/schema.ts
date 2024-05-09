import { DocumentData } from 'firebase-admin/firestore';
import { TaxRatio } from '../../helper/types';

/**
 * 販売実績データ（注文別）
 */
export interface IFinalizedSalesByOrderDocument extends DocumentData {
  finalizedAt: number; // UnixTime
  inventoryId: string;
  leoId: string;
  orderId: string;
  divisionCode: string; // 部門コード
  divisionName: string; // 部門名
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元
  productName: string;
  unitPrice: number; // 単価
  quantity: number;
  salesAmount: number; // 売上
  costPrice: number; //原価
  shippingFee: number; // 送料
  commissionFee: number; // 手数料
  advertisingFee: number; // 広告宣伝費
  promotionFee: number; // 販売促進費
  click?: number;
  amazonCvr?: number;
  cpc?: number;
  ctr?: number;
  cpa?: number;
  roas?: number;
  sales?: number;
  conversion?: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface IFinalizedSalesByOrder {
  finalizedAt: number; // UnixTime
  inventoryId: string;
  leoId: string;
  orderId: string;
  divisionCode: string; // 部門コード
  divisionName: string; // 部門名
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元
  productName: string;
  unitPrice: number; // 単価
  quantity: number;
  salesAmount: number; // 売上
  costPrice: number; //原価
  shippingFee: number; // 送料
  commissionFee: number; // 手数料
  advertisingFee: number; // 広告宣伝費
  promotionFee: number; // 販売促進費
  click?: number;
  amazonCvr?: number;
  cpc?: number;
  ctr?: number;
  cpa?: number;
  roas?: number;
  sales?: number;
  conversion?: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}
