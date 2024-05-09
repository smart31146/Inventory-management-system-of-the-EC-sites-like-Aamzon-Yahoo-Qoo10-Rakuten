import { DocumentData } from 'firebase-admin/firestore';
import { TaxRatio } from '../../helper/types';

/**
 * 販売実績データ（商品別）
 */
export interface IFinalizedSalesByProductDocument extends DocumentData {
  finalizedAt: number; // UnixTime
  inventoryId: string;
  leoId: string; // マスタID
  divisionCode: string; // 部門コード
  divisionName: string; // 部門名
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元
  productName: string;
  unitPrice: number; // 単価
  originalPrice: number; // 定価
  quantity: number;
  taxRatio: TaxRatio;
  ordersQuantity: number;
  salesAmount: number; // 売上
  costPriceTotal: number; // 原価
  shippingFeeTotal: number; // 送料
  commissionFeeTotal: number; // 手数料
  advertisingFeeTotal: number; // 広告宣伝費
  promotionFeeTotal: number; // 販売促進費
  profitAmountTotal: number; // 一次利益
  profitAmountRate: number; // 一次利益率
  advertisingFeeTotalRate: number; // 広告費率
  averageUserUnitPrice: number; // 平均顧客単価
  averageUserProfitAmount: number; // 平均顧客一次利益
  averageGetQuantity: number; // 平均購入個数
  orders: string[];
  click: number;
  conversion: number;
  amazonCvr: number;
  cpc: number;
  ctr: number;
  cpa: number;
  roas: number;
  sales: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface IFinalizedSalesByProduct {
  finalizedAt: number; // UnixTime
  inventoryId: string;
  leoId: string; // マスタID
  divisionCode: string; // 部門コード
  divisionName: string; // 部門名
  salesChannelCode: string; // 販売元コード
  salesChannel: string; // 販売元
  productName: string;
  unitPrice: number; // 単価
  originalPrice: number; // 定価
  quantity: number;
  taxRatio: TaxRatio;
  ordersQuantity: number;
  salesAmount: number; // 売上
  costPriceTotal: number; // 原価
  shippingFeeTotal: number; // 送料
  commissionFeeTotal: number; // 手数料
  advertisingFeeTotal: number; // 広告宣伝費
  promotionFeeTotal: number; // 販売促進費
  profitAmountTotal: number; // 一次利益
  profitAmountRate: number; // 一次利益率
  advertisingFeeTotalRate: number; // 広告費率
  averageUserUnitPrice: number; // 平均顧客単価
  averageUserProfitAmount: number; // 平均顧客一次利益
  averageGetQuantity: number; // 平均購入個数
  orders: string[];
  click: number;
  conversion: number;
  amazonCvr: number;
  cpc: number;
  ctr: number;
  cpa: number;
  roas: number;
  sales: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface IFinalizedSalesByProductSheetRow {
  出荷確定日: string
  在庫ID: string
  マスタID: string;
  販売元コード: string
  販売チャネル: string
  部門コード: string
  部門名: string
  商品名: string
  単価: string
  税率: string
  販売数量: string
  注文数: string
  売上: string
  原価: string
  送料: string
  手数料: string
  広告費: string
  一次利益: string
  一次利益率: string
  広告費率: string
  CVR: string
  平均顧客単価: string
  平均顧客一次利益: string
  平均購入個数: string
}
