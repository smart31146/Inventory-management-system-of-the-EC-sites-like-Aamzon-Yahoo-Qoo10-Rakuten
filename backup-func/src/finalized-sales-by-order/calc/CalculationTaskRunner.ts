import { ICostMaster } from '../../cost-master/models/schema';
import { IFinalizedShipping } from '../../finalized-shipping/models/schema';
import { IFinalizedSalesByOrder } from '../models/schema';

export type CalculationTask<T> = (
  finalizedShippingResult: IFinalizedShipping[], costMaster: ICostMaster[]
) => Promise<PromiseSettledResult<T>[]>;

export class CalculationTaskRunner<T> {
  constructor(private tasks: CalculationTask<T>[]) {}

  async run(finalizedShippingResult: IFinalizedShipping[], costMaster: ICostMaster[]  ) {
    const results = await Promise.all(this.tasks.map((t) => t(finalizedShippingResult, costMaster)));
    
    const rejected = results.flatMap((result) => {
      return result.filter(
        (r) => r.status === 'rejected'
      ) as PromiseRejectedResult[];
    });

    const fulfilled = results.flatMap((result) => {
      return result.filter(
        (r) => r.status === 'fulfilled'
      ) as PromiseFulfilledResult<IFinalizedSalesByOrder>[];
    });

    return {
      fulfilledResult: fulfilled.map((f) => f.value),
      rejectedResult: rejected,
    };
  }
}
