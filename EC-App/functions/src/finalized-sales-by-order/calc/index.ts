import { CalculationTaskRunner } from './CalculationTaskRunner';
import { amazonCalculationTask } from './tasks/amazonCalculationTask';
import { rakutenCalculationTask } from './tasks/rakutenCalculationTask';
import { qoo10CalculationTask } from './tasks/qoo10CalculationTask';
import { yahooCalculationTask } from './tasks/yahooCalculationTask';
import { FinalizedShippingRepository } from '../../finalized-shipping/models/repository';
import { CostMasterRepository } from '../../cost-master/models/repository';

/**
 * バッチ処理一式が完了したら実行される想定
 */
export const calcFinalizedSalesByOrder = async ({
  finalizedAt,
  salesChannel,
}: {
  finalizedAt: Date;
  salesChannel?: 'rakuten' | 'amazon' | 'yahoo' | 'qoo10' | 'inhouse';
}) => {
  const tasks = [];
  switch (salesChannel) {
    case 'rakuten':
      tasks.push(rakutenCalculationTask);
      break;
    case 'amazon':
      tasks.push(amazonCalculationTask);
      break;
    case 'yahoo':
      tasks.push(yahooCalculationTask);
      break;
    case 'qoo10':
      tasks.push(qoo10CalculationTask);
      break;
    case 'inhouse':
      tasks.push(rakutenCalculationTask);
      tasks.push(amazonCalculationTask);
      tasks.push(yahooCalculationTask);
      tasks.push(qoo10CalculationTask);
  }

  const runner = new CalculationTaskRunner([...tasks]);
  const { fulfilledResult } = await runner.run(finalizedAt);

  return fulfilledResult;
};
