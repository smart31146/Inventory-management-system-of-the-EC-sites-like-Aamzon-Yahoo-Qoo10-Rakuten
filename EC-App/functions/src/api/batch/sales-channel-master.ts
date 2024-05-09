import { topics } from '../topics';
import { runTime } from '../../helper';
import { salesChannelMasterBatch } from '../../sales-channel-master/batch';
import { PubSub } from '@google-cloud/pubsub';

export const salesChannelMaster = runTime.pubsub
  .topic(topics.batch.salesChannelMaster)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.salesChannelMaster}`);

    await salesChannelMasterBatch();
  });

export const salesChannelMasterOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.batch.salesChannelMaster}`);

  const pubsub = new PubSub();
  await pubsub
    .topic(topics.batch.salesChannelMaster)
    .publishMessage({ json: {} });
});
