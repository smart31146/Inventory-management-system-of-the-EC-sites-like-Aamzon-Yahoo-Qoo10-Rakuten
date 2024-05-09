import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IInventoryUnitPrice,
  IInventoryUnitPriceCSV,
  IInventoryUnitPriceDocument,
} from './schema';
import { StringToFloat, StringToFloat_InventoryUnitPrice } from '../../helper/valuePerse';

export class InventoryUnitPriceConverter
  implements FirestoreDataConverter<IInventoryUnitPrice>
{
  toFirestore(entity: IInventoryUnitPrice): IInventoryUnitPriceDocument {
    return {
      aggregatedAt: entity.aggregatedAt,
      inventoryId: entity.inventoryId,
      productName: entity.productName,
      carriedInventoryQuantity: entity.carriedInventoryQuantity,
      instockQuantity: entity.instockQuantity,
      shippedQuantity: entity.shippedQuantity,
      inventoryQuantity: entity.inventoryQuantity,
      unitPrice: entity.unitPrice,
      totalPrice: entity.totalPrice,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<IInventoryUnitPriceDocument>
  ): IInventoryUnitPrice {
    const data = snapshot.data();
    return {
      aggregatedAt: data.aggregatedAt,
      inventoryId: data.inventoryId,
      productName: data.productName,
      carriedInventoryQuantity: data.carriedInventoryQuantity,
      instockQuantity: data.instockQuantity,
      shippedQuantity: data.shippedQuantity,
      inventoryQuantity: data.inventoryQuantity,
      unitPrice: data.unitPrice,
      totalPrice: data.totalPrice,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  fromCsvRow(
    aggregatedDate: Date,
    row: IInventoryUnitPriceCSV
  ): IInventoryUnitPrice {
    return {
      aggregatedAt: aggregatedDate.getTime(),
      inventoryId: row['商品コード'] || '',
      productName: row['商品名'] || '',
      totalPrice: Number(row['在庫金額']) || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      // CSVファイルにて「コンマ+小数点」で書かれているものは浮動小数値に変換
      carriedInventoryQuantity: StringToFloat((row['繰越残数']||'0').toString()) || 0,
      instockQuantity: StringToFloat((row['入荷数量']||'0').toString()) || 0,
      shippedQuantity: StringToFloat((row['出荷数量']||'0').toString()) || 0,
      inventoryQuantity: StringToFloat((row['現品残数'] || "0").toString()) || 0,    // 在庫残数 -> 現品残数？
      unitPrice: StringToFloat((row['在庫単価'] || "0").toString()) || 0,
      
    };
  }
}
