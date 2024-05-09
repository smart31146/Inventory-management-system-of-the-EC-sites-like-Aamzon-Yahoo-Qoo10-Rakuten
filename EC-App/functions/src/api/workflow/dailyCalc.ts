import { PubSub } from '@google-cloud/pubsub';
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic';
import { runTime } from '../../helper';
import { topics } from '../topics';

const dailyCalcTopics: {
  label: string;
  name: string;
  message: MessageOptions;
}[] = [
  {
    label: '販売実績データ演算',
    name: topics.calc.finalizedSales,
    message: { json: {} },
  },
];

export const dailyCalc = runTime.pubsub
  .topic(topics.workflow.dailyCalc)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.workflow.dailyCalc}`);

    const pubsub = new PubSub();

    dailyCalcTopics.forEach((topic) => {
      pubsub.topic(topic.name).publishMessage(topic.message);
    });
  });

export const dailyCalcOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.workflow.dailyCalc}`);

  const pubsub = new PubSub();
  await pubsub.topic(topics.workflow.dailyCalc).publishMessage({ json: {} });
});

export const dailyCalcSchedule = runTime.pubsub
  .schedule('0 7 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    console.log(`on run scheduled ${topics.workflow.dailyCalc}`);

    const pubsub = new PubSub();
    await pubsub.topic(topics.workflow.dailyCalc).publishMessage({ json: {} });
  });
