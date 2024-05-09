import { topics } from '../topics';
import { runTime } from '../../helper';
import { costMasterBatch } from '../../cost-master/batch';
import { PubSub } from '@google-cloud/pubsub';

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const costMaster = runTime.pubsub
  .topic(topics.batch.costMaster)
  .onPublish(async (message) => {

    // 通過ログ
    console.log(`on publish ${topics.batch.costMaster}`);

    // バッチ実行の呼び出し
    await costMasterBatch();
  });

//--------------------------------------------------------------------------------------------
/**
 * フロント画面からの呼び出し関数
 */
//--------------------------------------------------------------------------------------------
export const costMasterOnCall = runTime.https.onCall(async (data) => {

  // 通過ログ
  console.log(`on call ${topics.batch.costMaster}`);

  // pubsub取得
  // TOPICの関数の呼び出し
  const pubsub = new PubSub();
  await pubsub
    .topic(topics.batch.costMaster)
    .publishMessage({ json: {} });
});
