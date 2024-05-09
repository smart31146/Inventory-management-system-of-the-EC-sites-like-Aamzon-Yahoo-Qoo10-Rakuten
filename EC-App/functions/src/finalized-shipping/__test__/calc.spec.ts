import { describe, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { getDailyFinalizedShipping } from '../batch/getDailyFinalizedShipping';
//import { distributeLineItems } from '../calc/distributeLineItems';

jest.setTimeout(120000);

const { wrap } = initTesting();

describe('batch of finalized shipping', () => {
  it('Unit test: distributeLineItems', async () => {
    // const today = new Date('2023-12-12');
    // const data = await getDailyFinalizedShipping(today);
    // const result = distributeLineItems(data);

    // console.log('result[0]', result[0]);
    // console.log('result[8]', result[8]);
    // console.log('result[11]', result[11]);
    // console.log('order: 1cb695fe84', result.filter(r => r.orderId === "1cb695fe84"));
    // expect(result[0].distributedTotalPrice).toBe(11180);
    // expect(result[1].distributedTotalPrice).toBe(5007);
    // expect(result[8].distributedTotalPrice).toBe(9780);
    // expect(result[11].distributedTotalPrice).toBe(5190);
    // expect(result.every(r => r.distributedDiscount >= 0)).toBe(true);
    // expect(result.every(r => r.distributedShippingFee >= 0)).toBe(true);
    // expect(result.every(r => r.distributedCommissionFee >= 0)).toBe(true);
  });
});
