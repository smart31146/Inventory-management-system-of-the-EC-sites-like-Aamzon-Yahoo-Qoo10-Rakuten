import { PubSub } from '@google-cloud/pubsub';
import { runTime } from '../../helper';
import { topics } from '../topics';
import { inventoryUnitPriceBatch } from '../../inventory-unit-price/batch';

export const monthly = runTime.pubsub
  .topic(topics.workflow.monthly)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.workflow.monthly}`);

    const thisMonth = new Date();
    const lastMonth = new Date(
      thisMonth.getFullYear(),
      thisMonth.getMonth() - 1,
      1
    );
    await inventoryUnitPriceBatch(lastMonth);
  });

export const monthlyOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.workflow.monthly}`);

  const pubsub = new PubSub();
  await pubsub.topic(topics.workflow.monthly).publishMessage({ json: {} });
});

export const monthlySchedule = runTime.pubsub
  .schedule('0 6 1 * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    console.log(`on run scheduled ${topics.workflow.monthly}`);

    const pubsub = new PubSub();
    await pubsub.topic(topics.workflow.monthly).publishMessage({ json: {} });
  });
