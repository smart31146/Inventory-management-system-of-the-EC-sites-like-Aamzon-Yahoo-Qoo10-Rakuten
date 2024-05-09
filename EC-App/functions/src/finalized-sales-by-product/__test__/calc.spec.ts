import { describe, expect, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { aggregate } from '../calc/aggregate';
import { finalizedSalesByOrderSeeds as seeds } from './seeds';

jest.setTimeout(120000);

initTesting();

describe('calculation of finalized sales by product', () => {
  it('Unit Test: aggregate', async () => {
    const result = await aggregate(seeds);

    /**
     * 出荷確定日・販売チャネル（販売チャネルコード・）・商品コードが一致するように集計できていることを確認する
     */
    expect(result[0].finalizedAt).toEqual(seeds[0].finalizedAt);
    expect(result[0].salesChannel).toEqual(seeds[0].salesChannel);
    expect(result[0].salesChannelCode).toEqual(seeds[0].salesChannelCode);
    expect(result[0].inventoryId).toEqual(seeds[0].inventoryId);
  });
});
