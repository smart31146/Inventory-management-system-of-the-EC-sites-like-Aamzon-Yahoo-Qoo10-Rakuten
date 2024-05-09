import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  Tenant,
  IFinalizedShipping,
  IFinalizedShippingCsv,
  IFinalizedShippingDocument,
} from './schema';
import { SalesChannel } from '../../helper/types';
import { IProductMaster3 } from '../../products-master-3/models/schema';
import { CommissionFeeRate as AmazonFee } from '../../amazon/constants';
import { CommissionFeeRate as RakutenFee} from '../../rakuten/constants';
import { CommissionFeeRate as Qoo10Fee} from '../../qoo10/constants';

//-------------------------------------------------------------------------------
/**
 * 売上確定データのコンバータ
 */
//-------------------------------------------------------------------------------
export class FinalizedShippingConverter implements FirestoreDataConverter<IFinalizedShipping>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity
   * @returns
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IFinalizedShipping): IFinalizedShippingDocument 
  {
    return {
      orderId: entity.orderId,
      inventoryId: entity.inventoryId,
      productName: entity.productName,
      unitPrice: entity.unitPrice,
      quantity: entity.quantity,
      totalPrice: entity.totalPrice,
      shippingFee: entity.shippingFee,
      promotionDiscount: entity.promotionDiscount,
      commissionFee: entity.commissionFee,
      finalizedAt: entity.finalizedAt,
      salesChannel: entity.salesChannel,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot
   * @returns
   */
  //-------------------------------------------------------------------------------
  fromFirestore( snapshot: QueryDocumentSnapshot<IFinalizedShippingDocument> ): IFinalizedShipping 
  {
    const data = snapshot.data();
    return {
      orderId: data.orderId,
      inventoryId: data.inventoryId,
      productName: data.productName,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      shippingFee: data.shippingFee,
      commissionFee: data.commissionFee,
      promotionDiscount: data.promotionDiscount,
      finalizedAt: data.finalizedAt,
      salesChannel: data.salesChannel,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   * @param tenant
   * @param shippingDate
   * @param row
   * @returns
   */
  //-------------------------------------------------------------------------------
  fromCsvRow( tenant: Tenant, shippingDate: Date, row: IFinalizedShippingCsv, productMaster3: IProductMaster3[] ): IFinalizedShipping | null
  {
    // テナントによって分岐
    switch (tenant) 
    {
      //---------------------
      // FBA
      //---------------------
      case 'FBA': {

        // 数量
        const quantity = Number( row['quantity'] ) || 0;

        // 単価（単価/数量）
        // 単価は既に数量を乗算した値となっているので正規の値に戻す
        const u = Number( row['item-price'] ) || 0;
        const unitPrice = u / quantity;

        // 合計金額（単価*数量）
        const totalPrice = unitPrice * quantity;

        // 出荷確定日
        //  - 0時にフォーマット
        //  - 日本時間に設定
        //  - UnixTimeに変換
        const f = shippingDate; //new Date(row['purchase-date']);
        f.setHours(0, 0, 0, 0);
        const finalizedDate = new Date(f.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const finalizedAt = finalizedDate.getTime();

        const found = productMaster3.find((product) => product.sku === row['sku']);
        const shippingFee = Number(found?.shippingPrice.replace('¥', '') || 0) * quantity;
        const commissionFee = Number(found?.commission.replace('¥', '') || unitPrice * AmazonFee) * quantity;

        const discount = row['item-promotion-discount'] || 0;

        if(row['item-status'] === "Cancelled") return null;
        
        return  {
          orderId: row['amazon-order-id'] || '',
          inventoryId: row['sku'] || '',
          productName: row['product-name'] || '',
          unitPrice: unitPrice || 0,
          quantity: quantity || 0,
          totalPrice: totalPrice || 0,
          shippingFee,
          commissionFee,
          promotionDiscount: discount * quantity,
          finalizedAt: finalizedAt,
          salesChannel: SalesChannel.Amazon,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        };

      }

      //---------------------
      // RSL
      //---------------------
      case 'RSL': {

        // 単価
        // 数量
        const unitPrice = Number(row['単価']) || 0;
        const quantity = Number(row['個数']) || 0;

        // 合計金額（単価*数量）
        const totalPrice = unitPrice * quantity;

        // 出荷確定日
        //  - 0時にフォーマット
        //  - 日本時間に設定
        //  - UnixTimeに変換
        const f = shippingDate; //new Date(row['注文確定日時']);
        f.setHours(0, 0, 0, 0);
        const finalizedDate = new Date(f.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const finalizedAt = finalizedDate.getTime();

        const pointsGranted = totalPrice * 0.01;
        const couponDiscount = (row['店舗発行クーポン利用額'] || 0)/ 1.1;

        const promotionDiscount = pointsGranted + couponDiscount;

        

        // テナント専用パラメータ
        //  - ショップ名
        //  - 注文番号
        //  - 在庫ID
        //  - 商品名
        //  - 単価
        //  - 数量
        //  - 合計金額
        //  - 税率
        //  - 送料
        //  - 出荷確定日
        //  - 販売チャンネル
        return {
          orderId: row['注文番号'] || '',
          inventoryId: row['商品管理番号'] || '',
          productName: row['商品名'] || '',
          unitPrice: unitPrice || 0,
          quantity: quantity || 0,
          totalPrice: totalPrice || 0,
          shippingFee: !row['配送方法'] ? 0 : row['配送方法'] === '宅配便' ? 380 : 180,
          promotionDiscount,
          commissionFee: totalPrice * RakutenFee,
          finalizedAt: finalizedAt,
          salesChannel: SalesChannel.Rakuten,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        };
      }

      //---------------------
      // SEIWA_YAHOO
      //---------------------
      case 'SEIWA_YAHOO': {

        // 単価
        // 数量
        const unitPrice = Number(row['UnitPrice']) || 0;
        const quantity = Number(row['Quantity']) || 0;

        // 合計金額（単価*数量）
        const totalPrice = unitPrice * quantity;

        // 出荷確定日
        //  - 0時にフォーマット
        //  - 日本時間に設定
        //  - UnixTimeに変換
        const f = shippingDate; //new Date(row['LeadTimeStart']);
        f.setHours(0, 0, 0, 0);
        const finalizedDate = new Date(f.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const finalizedAt = finalizedDate.getTime();

        const inventoryId = `${row['ItemId']}${row['SubCode']}`;
        const productName = `${row['Title']}${row['ItemOptionValue']}`;

        const couponDiscount = Number(row['CouponDiscount']) || 0;

        // テナント専用パラメータ
        //  - ショップ名
        //  - 注文番号
        //  - 在庫ID
        //  - 商品名
        //  - 単価
        //  - 数量
        //  - 合計金額
        //  - 税率
        //  - 送料
        //  - 出荷確定日
        //  - 販売チャンネル
        return  {
          orderId: row['Id'] || '',
          inventoryId: inventoryId || '',
          productName: productName || '',
          unitPrice: unitPrice,
          quantity: quantity,
          totalPrice: totalPrice,
          promotionDiscount: couponDiscount * quantity,
          shippingFee: 0,
          finalizedAt: finalizedAt,
          salesChannel: SalesChannel.Yahoo,
          commissionFee: 0,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        };
      }

      //---------------------
      // SEIWA_QOO10
      //---------------------
      case 'SEIWA_QOO10': {

        // 単価
        // 数量
        const unitPrice = Number(row['販売価格'].replace(/,/g, '')) || 0;
        const quantity = Number(row['数量']) || 0;

        // 合計金額（単価*数量）
        const totalPrice = unitPrice * quantity;

        // 出荷確定日
        //  - 0時にフォーマット
        //  - 日本時間に設定
        //  - UnixTimeに変換
        const f = shippingDate; //new Date(row['購入者の決済日']);
        f.setHours(0, 0, 0, 0);
        const finalizedDate = new Date(f.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const finalizedAt = finalizedDate.getTime();

        // 在庫ID
        //  -「販売者コード、販売者オプションコード」を合わせた物を在庫IDとする
        const optionCode = row['販売者オプションコード'];
        const inventoryId = `${row['販売者コード']}${optionCode ? `-${optionCode}` : ''}`;
        const productName = `${row['商品名']}${row['オプション情報']}`;

        // テナント専用パラメータ
        //  - ショップ名
        //  - 注文番号
        //  - 在庫ID
        //  - 商品名
        //  - 単価
        //  - 数量
        //  - 合計金額
        //  - 税率
        //  - 送料
        //  - 出荷確定日
        //  - 販売チャンネル
       return {
          orderId: row['注文番号'] || '',
          inventoryId: inventoryId || '',
          productName: productName || '',
          unitPrice: unitPrice || 0,
          quantity: quantity || 0,
          totalPrice: totalPrice,
          shippingFee: 0,
          promotionDiscount: row['販売店負担割引金額'] || 0,
          commissionFee: totalPrice * Qoo10Fee,
          finalizedAt: finalizedAt,
          salesChannel: SalesChannel.Qoo10,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        };
      }
    }
  }
}
