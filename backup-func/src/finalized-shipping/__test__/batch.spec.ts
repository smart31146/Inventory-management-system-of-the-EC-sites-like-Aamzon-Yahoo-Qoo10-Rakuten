import { describe, expect, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { finalizedShippingBatch } from '../batch';
import { insertDailyFinalizedShipping } from '../batch/insertDailyFinalizedShipping';
import { getDailyFinalizedShipping } from '../batch/getDailyFinalizedShipping';
import { IFinalizedShipping } from '../models/schema';

jest.setTimeout(120000);

initTesting();

// const testData: IFinalizedShipping = {
//   shopName: '',
//   orderId: '250-8983427-6355860-UL',
//   inventoryId: '1100271',
//   productName: 'ウルトラ ホエイダイエットプロテイン 抹茶ラテ風味 1,000g',
//   unitPrice: 5940,
//   quantity: 1,
//   totalPrice: 5940,
//   taxRatio: 0.08,
//   shippingFee: 0,
//   commissionFee: 0,
//   finalizedAt: 1694271600000,
//   option1: '2023/9/10',
//   inputFormat: '',
//   option2: '',
//   createdAt: 1701783273441,
//   updatedAt: 1701783273441,
// };

describe('batch of finalized shipping', () => {
  it('E2E: runDailyJobs', async () => {
    //await finalizedShippingBatch(new Date('2024-01-17'), 'c009');
  });

  it('Unit test: getDailyFinalizedShipping', async () => {
    // await expect(getDailyFinalizedShipping(today)).resolves.not.toThrow();
  });

  it('Unit test: insertDailyFinalizedShipping', async () => {
    // await expect(
    //   insertDailyFinalizedShipping([testData])
    // ).resolves.toBeUndefined();
  });
});
