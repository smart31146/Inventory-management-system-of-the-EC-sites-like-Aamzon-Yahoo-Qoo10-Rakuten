import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IFinalizedSalesByOrder,
  IFinalizedSalesByOrderDocument,
} from './schema';

export class FinalizedSalesByOrderConverter
  implements FirestoreDataConverter<IFinalizedSalesByOrder>
{
  toFirestore(entity: IFinalizedSalesByOrder): IFinalizedSalesByOrderDocument {
    return {
      finalizedAt: entity.finalizedAt,
      inventoryId: entity.inventoryId,
      orderId: entity.orderId,
      leoId: entity.leoId,
      divisionCode: entity.divisionCode,
      divisionName: entity.divisionName,
      salesChannelCode: entity.salesChannelCode,
      salesChannel: entity.salesChannel,
      productName: entity.productName,
      unitPrice: entity.unitPrice,
      quantity: entity.quantity,
      salesAmount: entity.salesAmount,
      costPrice: entity.costPrice,
      shippingFee: entity.shippingFee,
      commissionFee: entity.commissionFee,
      advertisingFee: entity.advertisingFee,
      promotionFee: entity.promotionFee,
      click: entity.click,
      cpa: entity.cpa,
      conversion: entity.conversion,
      amazonCvr: entity.amazonCvr,
      cpc: entity.cpc,
      ctr: entity.ctr,
      roas: entity.roas,
      sales: entity.sales,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<IFinalizedSalesByOrderDocument>
  ): IFinalizedSalesByOrder {
    const data = snapshot.data();
    return {
      finalizedAt: data.finalizedAt,
      inventoryId: data.inventoryId,
      leoId: data.leoId,
      orderId: data.orderId,
      divisionCode: data.divisionCode,
      divisionName: data.divisionName,
      salesChannelCode: data.salesChannelCode,
      salesChannel: data.salesChannel,
      productName: data.productName,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      //taxRatio: data.taxRatio,
      salesAmount: data.salesAmount,
      costPrice: data.costPrice,
      shippingFee: data.shippingFee,
      commissionFee: data.commissionFee,
      advertisingFee: data.advertisingFee,
      promotionFee: data.promotionFee,
      click: data.click,
      cpa: data.cpa,
      conversion: data.conversion,
      amazonCvr: data.amazonCvr,
      cpc: data.cpc,
      ctr: data.ctr,
      sales: data.sales,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
