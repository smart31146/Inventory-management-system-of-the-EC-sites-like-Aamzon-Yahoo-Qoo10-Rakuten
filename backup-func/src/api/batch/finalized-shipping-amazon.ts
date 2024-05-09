import { runTime } from '../../helper';
import { finalizedShippingBatch } from '../../finalized-shipping/batch';
import { PubSub } from '@google-cloud/pubsub';
import { topics } from '../topics';

//--------------------------------------------------------------------------------------------
/**
 * パラメータ
 */
//--------------------------------------------------------------------------------------------
type Params = {
  /**
   * 出荷確定日
   * 出荷確定データの検索に使用する
   * @required
   * @format YYYY-MM-DD
   */
  finalizedAt?: string;
};

//--------------------------------------------------------------------------------------------
/**
 * フロント画面からの呼び出し関数
 *  - 対象：【C009】finalized-shipping-amazon
 */
//--------------------------------------------------------------------------------------------
export const finalizedShippingAmazonOnCall = runTime.https.onCall(
  async (data: { params?: Params }) => {

    // 通過ログ
    console.log(`on call ${topics.batch.finalizedShippingAmazon}`);
  
    // パラメータ取得
    // pubsub取得
    // finalizedShipping関数の呼び出し
    const params = data?.params;
    const pubsub = new PubSub();
    await pubsub
      .topic(topics.batch.finalizedShippingAmazon)
      .publishMessage({ json: { params: { ...params } } });
  }
);

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const finalizedShippingAmazon = runTime.pubsub
  .topic(topics.batch.finalizedShippingAmazon)
  .onPublish(async (message) => {

    // 通過ログ
    console.log(`on publish ${topics.batch.finalizedShippingAmazon}`);

    /**
     * 日付指定して実行するには日付文字列を message.json.params.finalizedAt に入れて送る
     */
    const params = message.json?.params as Params | undefined;
    const finalizedAt =
      params?.finalizedAt &&
      typeof params.finalizedAt !== 'undefined' &&
      params.finalizedAt !== ''
        ? new Date(params.finalizedAt)
        : new Date();

    // バッチ実行の呼び出し
    await finalizedShippingBatch(finalizedAt, 'c009');
  }
);