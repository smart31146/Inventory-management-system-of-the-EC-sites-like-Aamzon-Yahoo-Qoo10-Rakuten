import { SalesChannel } from '../../../helper/types';
import { CommissionFeeRate } from '../../../rakuten/constants';
import { Relations } from '../../models/relations';
import { IFinalizedSalesByOrder } from '../../models/schema';
import { CalculationLog } from '../CalculationLog';
import { CalculationTask } from '../CalculationTaskRunner';
import { FinalizedShippingRepository } from '../../../finalized-shipping/models/repository';
import { CostMasterRepository } from '../../../cost-master/models/repository';

export const inhouseCalculationTask: CalculationTask<
  IFinalizedSalesByOrder
> = async (finalizedAt: Date) => {
  const relations = await Relations.init();

    
  const finalizedShipping = new FinalizedShippingRepository();
  const costMaster = new CostMasterRepository();

  const inhouseList = await finalizedShipping.getAll({
    finalizedAt: finalizedAt.getTime(),
    salesChannel: SalesChannel.Inhouse,
  });

  const result = await Promise.allSettled(
    inhouseList.map(
      async (fs): Promise<IFinalizedSalesByOrder & { log: CalculationLog }> => {
        const inventoryId = fs.inventoryId;
        const orderId = fs.orderId;

        const log = new CalculationLog(inventoryId, orderId);

        const division = relations.divisionCodeMaster.find(
          (d) => d.brandName === relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.brandName
        );

        if (typeof division === 'undefined') {
          log.error('division not found');
        }

        const salesChannel = relations.salesChannelMaster.find(
          (c) => c.salesChannel === fs.salesChannel
        );

        if (typeof salesChannel === 'undefined') {
          log.error('salesChannel not found');
        }

        const leoId = relations.productMaster2.find((p) => p.inventoryId === fs.inventoryId)?.leoId || "";
        const cost = await costMaster.getOne({ leoId });
        const inventoryUnitPrice = cost?.costPrice || 0;

        

        // 原価 = 在庫単価 * 販売数量
        const inventoryTotalPrice = inventoryUnitPrice * fs.quantity;

        // 手数料 = 売上 * 手数料率
        const commissionFee =
          fs.commissionFee + fs.totalPrice * CommissionFeeRate;

        // エラーログ記録があればログ出力する
        if( log.errorCount() === 0 ){
          log.message('calculation success');
        }

        return {
          ...fs,
          leoId,
          costPrice : inventoryTotalPrice,
          divisionCode: division?.divisionCode || '',
          divisionName: division?.divisionName || '',
          salesChannelCode: salesChannel?.salesChannelCode || '',
          salesChannel: salesChannel?.salesChannel || '',
          advertisingFee: 0,
          promotionFee: 0,
          commissionFee,
          salesAmount: fs.totalPrice,
          log,
        };
      }
    )
  );

  return result;
};
