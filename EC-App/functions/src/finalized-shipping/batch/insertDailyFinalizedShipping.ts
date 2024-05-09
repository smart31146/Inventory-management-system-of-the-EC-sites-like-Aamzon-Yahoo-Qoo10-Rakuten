import { IFinalizedShipping } from '../models/schema';
import { FinalizedShippingRepository } from '../models/repository';

/**
 *
 */
export const insertDailyFinalizedShipping = async (
  shipping: IFinalizedShipping[]
) => {
  const repo = new FinalizedShippingRepository();
  return await repo.batchCreate(shipping);
};
