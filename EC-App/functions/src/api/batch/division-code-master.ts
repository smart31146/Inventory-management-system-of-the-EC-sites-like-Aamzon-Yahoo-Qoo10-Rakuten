import { topics } from '../topics';
import { runTime } from '../../helper';
import { PubSub } from '@google-cloud/pubsub';
import { divisionCodeMasterBatch } from '../../division-code-master/batch';

export const divisionCodeMaster = runTime.pubsub
  .topic(topics.batch.divisionCodeMaster)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.divisionCodeMaster}`);

    await divisionCodeMasterBatch();
  });

export const divisionCodeMasterOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.batch.divisionCodeMaster}`);

  const pubsub = new PubSub();
  await pubsub
    .topic(topics.batch.divisionCodeMaster)
    .publishMessage({ json: {} });
});
