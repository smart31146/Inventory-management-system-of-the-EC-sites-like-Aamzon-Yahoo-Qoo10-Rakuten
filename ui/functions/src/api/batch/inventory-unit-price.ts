import { PubSub } from '@google-cloud/pubsub';
import { runTime } from '../../helper';
import { inventoryUnitPriceBatch } from '../../inventory-unit-price/batch';
import { topics } from '../topics';

type Params = {
  /**
   * 集計月
   * CSVファイル名の検索に利用する
   * @required
   * @format YYYY-MM-DD
   */
  aggregatedAt: string;
};

export const invantoryUnitPrice = runTime.pubsub
  .topic(topics.batch.invantoryUnitPrice)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.invantoryUnitPrice}`);

    /**
     * 日付指定して実行するには日付文字列を message.json.params.aggregatedAt に入れて送る
     */
    const params = message.json?.params as Params | undefined;
    const aggregatedAt = params?.aggregatedAt
      ? new Date(params.aggregatedAt)
      : new Date();

    await inventoryUnitPriceBatch(aggregatedAt);
  });

export const invantoryUnitPriceOnCall = runTime.https.onCall(
  async (data: { params?: Params }) => {
    console.log(`on call ${topics.batch.invantoryUnitPrice}`);

    const params = data?.params || {};

    const pubsub = new PubSub();
    await pubsub
      .topic(topics.batch.invantoryUnitPrice)
      .publishMessage({ json: { params: { ...params } } });
  }
);
