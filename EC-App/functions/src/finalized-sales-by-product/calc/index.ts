import { IFinalizedSalesByOrder } from '../../finalized-sales-by-order/models/schema';
import { aggregate } from './aggregate';

export const calcFinalizedSalesByProduct = async (
  finalizedSalesByOrder: IFinalizedSalesByOrder[]
) => {
  const result = await aggregate(finalizedSalesByOrder);

  return result;
};
