import { DocumentData } from 'firebase-admin/firestore';

export interface IInventoryUnitPriceDocument extends DocumentData {
  aggregatedAt: number; // 集計月 UnixTime
  inventoryId: string;
  productName: string;
  carriedInventoryQuantity: number;
  instockQuantity: number;
  shippedQuantity: number;
  inventoryQuantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface IInventoryUnitPrice {
  aggregatedAt: number; // 集計月 UnixTime
  inventoryId: string;
  productName: string;
  carriedInventoryQuantity: number;
  instockQuantity: number;
  shippedQuantity: number;
  inventoryQuantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: number; // UnixTime
  updatedAt: number; // UnixTime
}

export interface IInventoryUnitPriceCSV {
  商品コード: string;
  商品名: string;
  繰越残数: number;
  入荷数量: number;
  出荷数量: number;
  //在庫残数: number;  // 在庫残数 -> 現品残数？
  現品残数: number;
  在庫単価: number;
  在庫金額: number;
}
