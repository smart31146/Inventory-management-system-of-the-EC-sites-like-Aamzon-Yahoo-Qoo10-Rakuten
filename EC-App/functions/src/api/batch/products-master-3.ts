import { topics } from '../topics';
import { runTime } from '../../helper';
import { PubSub } from '@google-cloud/pubsub';
import { productsMaster3Batch } from '../../products-master-3/batch';

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const productsMaster3 = runTime.pubsub
  .topic(topics.batch.productsMaster3)
  .onPublish(async (message) => {

    // 通過ログ
    console.log(`on publish ${topics.batch.productsMaster3}`);

    // バッチ実行の呼び出し
    await productsMaster3Batch();
  });

//--------------------------------------------------------------------------------------------
/**
 * フロント画面からの呼び出し関数
 */
//--------------------------------------------------------------------------------------------
export const productsMaster3OnCall = runTime.https.onCall(async (data) => {

  // 通過ログ
  console.log(`on call ${topics.batch.productsMaster3}`);

  // pubsub取得
  // TOPICの関数の呼び出し
  const pubsub = new PubSub();
  await pubsub
    .topic(topics.batch.productsMaster3)
    .publishMessage({ json: {} });
});
