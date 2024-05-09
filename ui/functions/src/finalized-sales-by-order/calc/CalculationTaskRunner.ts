import { ICostMaster } from '../../cost-master/models/schema';
import { IFinalizedShipping } from '../../finalized-shipping/models/schema';
import { IFinalizedSalesByOrder } from '../models/schema';

export type CalculationTask<T> = (
  finalizedAt: Date
) => Promise<PromiseSettledResult<T>[]>;

export class CalculationTaskRunner<T> {
  constructor(private tasks: CalculationTask<T>[]) {}

  async run(finalizedAt: Date) {
    const results = await Promise.all(this.tasks.map((t) => t(finalizedAt)));
    
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
