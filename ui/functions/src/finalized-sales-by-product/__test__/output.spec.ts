import { describe, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { aggregate } from '../calc/aggregate';
import { outputFinalizedSalesToSheet } from '../../finalized-sales-by-product/output';
import { finalizedSalesByOrderSeeds as seeds } from './seeds';

jest.setTimeout(120000);

initTesting();

describe('output of finalized sales by product', () => {
  it('E2E', async () => {
    // const aggregated = await aggregate(new Date(), seeds);
    // await outputFinalizedSalesToSheet(aggregated);
  });
});
