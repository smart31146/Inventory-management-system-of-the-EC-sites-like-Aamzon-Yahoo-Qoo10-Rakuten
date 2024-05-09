import { PubSub } from '@google-cloud/pubsub';
import { amazonOrdersBatch } from '../../amazon/order/batch';
import { runTime } from '../../helper';
import { qoo10OrdersBatch } from '../../qoo10/order/batch';
import { rakutenOrdersBatch } from '../../rakuten/order/batch';
import { yahooOrdersBatch } from '../../yahoo/order/batch';
import { topics } from '../topics';

type Params = {
  /**
   * 集計日
   * CSVファイル名の検索に利用する
   * @required
   * @format YYYY-MM-DD
   */
  aggregatedAt: string;
  /**
   * 販売チャネル
   * 特定の販売チャネルのみを対象にする場合に指定する
   * @optional
   */
  salesChannel?: 'rakuten' | 'amazon' | 'yahoo' | 'qoo10';
};

export const orders = runTime.pubsub
  .topic(topics.batch.orders)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.orders}`);

    /**
     * 日付指定して実行するには日付文字列を message.json.params.aggregatedAt に入れて送る
     */
    const params = message.json?.params as Params | undefined;
    const aggregatedAt = params?.aggregatedAt
      ? new Date(params.aggregatedAt)
      : new Date();

    const salesChannel = params?.salesChannel;

    switch (salesChannel) {
      case 'rakuten':
        await rakutenOrdersBatch(aggregatedAt);
        break;
      case 'amazon':
        await amazonOrdersBatch(aggregatedAt);
        break;
      case 'yahoo':
        await yahooOrdersBatch(aggregatedAt);
        break;
      case 'qoo10':
        await qoo10OrdersBatch(aggregatedAt);
        break;
      default:
        await Promise.allSettled([
          rakutenOrdersBatch(aggregatedAt),
          amazonOrdersBatch(aggregatedAt),
          yahooOrdersBatch(aggregatedAt),
          qoo10OrdersBatch(aggregatedAt),
        ]);
        break;
    }
  });

export const ordersOnCall = runTime.https.onCall(
  async (data: { params?: Params }) => {
    console.log(`on call ${topics.batch.orders}`);

    const params = data?.params || {};

    const pubsub = new PubSub();
    await pubsub
      .topic(topics.batch.orders)
      .publishMessage({ json: { params: { ...params } } });
  }
);
