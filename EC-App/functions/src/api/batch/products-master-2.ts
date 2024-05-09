import { topics } from '../topics';
import { runTime } from '../../helper';
import { PubSub } from '@google-cloud/pubsub';
import { productsMaster2Batch } from '../../products-master-2/batch';

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const productsMaster2 = runTime.pubsub
  .topic(topics.batch.productsMaster2)
  .onPublish(async (message) => {

    // 通過ログ
    console.log(`on publish ${topics.batch.productsMaster2}`);

    // バッチ実行の呼び出し
    await productsMaster2Batch();
  });

//--------------------------------------------------------------------------------------------
/**
 * フロント画面からの呼び出し関数
 */
//--------------------------------------------------------------------------------------------
export const productsMaster2OnCall = runTime.https.onCall(async (data) => {

  // 通過ログ
  console.log(`on call ${topics.batch.productsMaster2}`);

  // pubsub取得
  // TOPICの関数の呼び出し
  const pubsub = new PubSub();
  await pubsub
    .topic(topics.batch.productsMaster2)
    .publishMessage({ json: {} });
});
