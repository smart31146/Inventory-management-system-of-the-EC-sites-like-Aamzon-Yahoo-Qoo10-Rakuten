import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IFinalizedSalesByProduct,
  IFinalizedSalesByProductDocument,
} from './schema';

export class FinalizedSalesByProductConverter
  implements FirestoreDataConverter<IFinalizedSalesByProduct>
{
  toFirestore(
    entity: IFinalizedSalesByProduct
  ): IFinalizedSalesByProductDocument {
    return {
      finalizedAt: entity.finalizedAt,
      inventoryId: entity.inventoryId,
      leoId: entity.leoId,
      divisionCode: entity.divisionCode,
      divisionName: entity.divisionName,
      salesChannelCode: entity.salesChannelCode,
      salesChannel: entity.salesChannel,
      productName: entity.productName,
      unitPrice: entity.unitPrice,
      originalPrice: entity.originalPrice,
      quantity: entity.quantity,
      taxRatio: entity.taxRatio,
      salesAmount: entity.salesAmount,
      shippingFeeTotal: entity.shippingFeeTotal,
      commissionFeeTotal: entity.commissionFeeTotal,
      advertisingFeeTotal: entity.advertisingFeeTotal,
      promotionFeeTotal: entity.promotionFeeTotal,
      profitAmountTotal: entity.profitAmountTotal,
      profitAmountRate: entity.profitAmountRate,
      advertisingFeeTotalRate: entity.advertisingFeeTotalRate,
      averageUserUnitPrice: entity.averageUserUnitPrice,
      averageUserProfitAmount: entity.averageUserProfitAmount,
      averageGetQuantity: entity.averageGetQuantity,
      costPriceTotal: entity.costPriceTotal,
      orders: entity.orders,
      ordersQuantity: entity.ordersQuantity,
      click: entity.click,
      conversion: entity.conversion,
      amazonCvr: entity.amazonCvr,
      cpc: entity.cpc,
      ctr: entity.ctr,
      cpa: entity.cpa,
      roas: entity.roas,
      sales: entity.sales,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<IFinalizedSalesByProductDocument>
  ): IFinalizedSalesByProduct {
    const data = snapshot.data();
    return {
      finalizedAt: data.finalizedAt,
      inventoryId: data.inventoryId,
      leoId: data.leoId,
      divisionCode: data.divisionCode,
      divisionName: data.divisionName,
      salesChannelCode: data.salesChannelCode,
      salesChannel: data.salesChannel,
      productName: data.productName,
      unitPrice: data.unitPrice,
      originalPrice: data.originalPrice,
      quantity: data.quantity,
      taxRatio: data.taxRatio,
      salesAmount: data.salesAmount,
      shippingFeeTotal: data.shippingFeeTotal,
      commissionFeeTotal: data.commissionFeeTotal,
      advertisingFeeTotal: data.advertisingFee,
      promotionFeeTotal: data.promotionFee,
      profitAmountTotal: data.profitAmount,
      profitAmountRate: data.profitAmountRate,
      advertisingFeeTotalRate: data.advertisingFeeTotalRate,
      averageUserUnitPrice: data.averageUserUnitPrice,
      averageUserProfitAmount: data.averageUserProfitAmount,
      averageGetQuantity: data.averageGetQuantity,
      costPriceTotal: data.costPriceTotal,
      orders: data.orders,
      ordersQuantity: data.ordersQuantity,
      click: data.click,
      conversion: data.conversion,
      amazonCvr: data.amazonCvr,
      cpc: data.cpc,
      ctr: data.ctr,
      cpa: data.cpa,
      roas: data.roas,
      sales: data.sales,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // TODO: 並び順を保証するためにヘッダーの順序を考慮する実装を入れる
  toSheetRow(entity: IFinalizedSalesByProduct): (string|number)[] {
    return [
      new Date(entity.finalizedAt).toLocaleDateString(),
      entity.inventoryId,
      entity.leoId,
      entity.salesChannelCode,
      entity.salesChannel,
      entity.divisionCode,
      entity.divisionName,
      entity.productName,
      entity.unitPrice,
      entity.originalPrice, //.toString(),
      entity.taxRatio,//.toString(),
      entity.quantity,//.toString(),
      entity.ordersQuantity,//.toString(),
      entity.salesAmount,//.toString(),
      entity.costPriceTotal,//.toString(),
      entity.shippingFeeTotal,//.toString(),
      entity.commissionFeeTotal,//.toString(),
      entity.advertisingFeeTotal,//.toString(),
      entity.profitAmountTotal,//.toString(),
      // 一次利益率
      // 広告費率
      // CVR
      // 平均顧客単価
      // 平均顧客一次利益
      // 平均購入個数
      entity.profitAmountRate,
      entity.advertisingFeeTotalRate,
      entity.promotionFeeTotal,
      entity.averageUserUnitPrice,
      entity.averageUserProfitAmount,
      entity.averageGetQuantity,
      entity.click,
      entity.conversion,
      entity.amazonCvr,
      entity.cpc,
      entity.ctr,
      entity.roas,
      entity.sales,
    ]
  }
}
