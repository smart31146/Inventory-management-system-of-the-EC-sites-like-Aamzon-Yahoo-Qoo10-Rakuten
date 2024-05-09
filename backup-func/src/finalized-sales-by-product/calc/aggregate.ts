import { CostMasterRepository } from '../../cost-master/models/repository';
import { ICostMaster } from '../../cost-master/models/schema';
import { AmazonRelations } from '../../finalized-sales-by-order/models/relations';
import { IFinalizedSalesByOrder } from '../../finalized-sales-by-order/models/schema';
import { mathRound } from '../../helper/mathRound';
import { TaxRatio } from '../../helper/types';
import { PercentToDecimal } from '../../helper/valuePerse';
import { ProductMaster2Repository } from '../../products-master-2/models/repository';
import { IProductMaster2 } from '../../products-master-2/models/schema';
import { IFinalizedSalesByProduct } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 注文毎の集計結果を商品毎に集計しなおす
 * @param finalizedSalesByOrder
 * @returns
 */
//-------------------------------------------------------------------------------
export const aggregate = async (
  finalizedSalesByOrder: IFinalizedSalesByOrder[]
): Promise<IFinalizedSalesByProduct[]> => {
  const productMaster2 = new ProductMaster2Repository();
  const costMaster = new CostMasterRepository();

  // 中間格納
  const intermediate: {
    [key: string]: IFinalizedSalesByProduct;
  } = {};

  // ユニークキーの作成
  // ユニークキーは「出荷確定日、在庫ID、販売チャンネル」によって構成
  const uniqueKey = (f: IFinalizedSalesByOrder) =>
    `${f.finalizedAt}_${f.inventoryId}_${f.salesChannel}`;

  // const products = await productMaster2.getAll();
  // const costs = await costMaster.getAll();
  
  // 演算結果で繰り返す
  finalizedSalesByOrder.forEach(async (f) => {
    const product = await productMaster2.getOne({ inventoryId: f.inventoryId });
    // const product = products.find((p) => f.inventoryId === p.inventoryId);
    const taxRatio = PercentToDecimal(product?.taxRatio || "0");

    const sellingPrice = product?.sellingPrice;
    const sellingPriceString = sellingPrice?.replace(/[^0-9.]/g, '');
    const sellingPriceValue = (sellingPriceString? parseFloat(sellingPriceString) : 0);

    const productName = product?.productName || '';

    // ユニークキーの取得
    // 予め設定した１レコード分のキー
    const key = uniqueKey(f);

    // 既に中間格納変数にデータが格納されているか判定
    if (intermediate[key]) 
    {
      // 既にデータが設定されている場青
      // 中間格納変数に集計の為の加算を行う
      intermediate[key].quantity += f.quantity;
      intermediate[key].ordersQuantity += 1;
      intermediate[key].salesAmount += (f.salesAmount - Math.floor(f.salesAmount * taxRatio));
      intermediate[key].costPriceTotal += f.costPrice,
      intermediate[key].shippingFeeTotal += f.shippingFee;
      intermediate[key].commissionFeeTotal += f.commissionFee;
      intermediate[key].advertisingFeeTotal += f.advertisingFee;
      intermediate[key].promotionFeeTotal += f.promotionFee;
      intermediate[key].orders.push(f.orderId);
    } 
    else 
    {
      // まだデータの設定がされてない場合
      // 中間格納変数に初回設定

      // 既に設定されている演算結果を変数に設定
      const { orderId, ...rest } = f;

      // 中間格納変数に初回設定
      intermediate[key] = {
       
        shippingFeeTotal: f.shippingFee, // 送料
        commissionFeeTotal: f.commissionFee, // 手数料
        advertisingFeeTotal: f.advertisingFee, // 広告宣伝費
        promotionFeeTotal: f.promotionFee, // 販売促進費
        costPriceTotal: f.costPrice, // 原価
       
        salesAmount: (f.salesAmount - Math.floor(f.salesAmount * taxRatio)), // 売上         
      
        orders: [orderId],
        ordersQuantity: 1,             
        quantity: f.quantity,

        inventoryId: f.inventoryId,
        leoId: f.leoId,
        productName,
        unitPrice: f.unitPrice,
        originalPrice: sellingPriceValue,
        taxRatio: taxRatio as TaxRatio,
        divisionCode: f.divisionCode,
        divisionName: f.divisionName,
        salesChannelCode: f.salesChannelCode,
        salesChannel: f.salesChannel,
  

        finalizedAt: f.finalizedAt,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,

        click: mathRound(rest.click || 0),
        conversion: mathRound(rest.conversion || 0, 2),
        amazonCvr: mathRound(rest.amazonCvr || 0, 2),
        cpc: mathRound(rest.cpc || 0, 2),
        ctr: mathRound(rest.ctr || 0, 2),
        cpa: mathRound(rest.cpa || 0, 2),
        roas: mathRound(rest.roas || 0, 2),
        sales: mathRound(rest.sales || 0),
        profitAmountTotal: 0,               // 一次利益
        profitAmountRate: 0,     // 一次利益率
        advertisingFeeTotalRate: 0,    // 広告費率
        averageUserUnitPrice: 0,       // 平均顧客単価
        averageUserProfitAmount: 0,    // 平均顧客一次利益
        averageGetQuantity: 0,         // 平均購入個数  
      };
    }
  });

  const relations = await AmazonRelations.init();
  const kpis = await relations.kpi.getAll();

  // この関数の結果を返却
  return Object.values(intermediate).map( (f) => {

    if (f.salesChannel === 'Amazon') {
      // const kpi = await relations.kpi.getByCondition({ inventoryId: f.inventoryId, finalizedAt: f.finalizedAt });
      const kpi = kpis.find((i) => i.productId === f.inventoryId && i.date === f.finalizedAt);
      f.promotionFeeTotal = kpi?.adFee || 0;
    }

    /**
     * 広告費は広告宣伝費と販売促進費の合算とする
     */
    const advertisingFeeTotal = f.advertisingFeeTotal + f.promotionFeeTotal;

    /**
     * 一次利益は「売上 - 原価 - 送料 - 手数料 - 広告費」の計算値とする
     */
    const profitAmount =
      f.salesAmount -
      f.costPriceTotal -
      f.shippingFeeTotal -
      f.commissionFeeTotal -
      advertisingFeeTotal;

    // 一次利益率 = 一次利益 / 売上
    const profitAmountRate = profitAmount / f.salesAmount;

    // 広告費率 = 広告費 / 売上
    const advertisingFeeTotalRate = advertisingFeeTotal / f.salesAmount;

    // 平均顧客単価 = 売上 / 注文数
    const averageUserUnitPrice = f.salesAmount / f.ordersQuantity;

    // 平均顧客一次利益 = 一次利益 / 注文数
    const averageUserProfitAmount = profitAmount / f.ordersQuantity;

    // 平均購入個数 = 販売数 / 注文数
    const averageGetQuantity = f.quantity / f.ordersQuantity;

    // 追加で割り出した内容を返却
    return {
      ...f,                                                           // 売上確定データ
      advertisingFeeTotal: mathRound(advertisingFeeTotal),            // 広告費
      profitAmountTotal: mathRound(profitAmount),                          // 一次利益
      profitAmountRate: mathRound(profitAmountRate),                  // 一次利益率
      advertisingFeeTotalRate: mathRound(advertisingFeeTotalRate, 2),    // 広告費率
      averageUserUnitPrice: mathRound(averageUserUnitPrice),          // 平均顧客単価
      averageUserProfitAmount: mathRound(averageUserProfitAmount),    // 平均顧客一次利益
      averageGetQuantity: mathRound(averageGetQuantity),              // 平均購入個数
    };
  });
};