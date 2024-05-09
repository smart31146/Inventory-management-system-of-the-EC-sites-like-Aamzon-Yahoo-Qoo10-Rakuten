import { runTime } from '../../helper';
import { calcFinalizedSalesByOrder } from '../../finalized-sales-by-order/calc';
import { calcFinalizedSalesByProduct } from '../../finalized-sales-by-product/calc';
import { topics } from '../topics';
import { PubSub } from '@google-cloud/pubsub';

type Params = {
  /**
   * 出荷確定日
   * 出荷確定データの検索に使用する
   * @required
   * @format YYYY-MM-DD
   */
  finalizedAt: string;
  /**
   * 販売チャネル
   * 特定の販売チャネルのみを対象にする場合に指定する
   * @optional
   */
  salesChannel?: 'rakuten' | 'amazon' | 'yahoo' | 'qoo10' | 'inhouse';
};

export const finalizedSales = runTime.pubsub
  .topic(topics.calc.finalizedSales)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.calc.finalizedSales}`);

    const params = message.json?.params as Params | undefined;
    const finalizedAt =
      params?.finalizedAt &&
      typeof params.finalizedAt !== 'undefined' &&
      params.finalizedAt !== ''
        ? new Date(params.finalizedAt)
        : new Date();
    const salesChannel = params?.salesChannel;

    const result1 = await calcFinalizedSalesByOrder({
      finalizedAt,
      salesChannel,
    });

    const result2 = await calcFinalizedSalesByProduct(result1)
  });

export const finalizedSalesOnCall = runTime.https.onCall(
  async (data: { params: Params }) => {
    console.log(`on call ${topics.calc.finalizedSales}`);
    const params = data?.params;
    const finalizedAt = params?.finalizedAt;
    const salesChannel = params?.salesChannel;

    const pubsub = new PubSub();
    await pubsub
      .topic(topics.calc.finalizedSales)
      .publishMessage({ json: { params: { finalizedAt, salesChannel } } });
  }
);
