import { describe, expect, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { PubSub } from '@google-cloud/pubsub';
import { topics } from '../topics';

initTesting();

describe('pubsub', () => {
  it('Unit test: publish message', async () => {
    const pubsub = new PubSub();
    const topic = pubsub.topic(topics.workflow.dailyBatch);
    const message = { json: { params: { finalizedAt: '2021-01-01' } } };
    // const mid = await topic.publishMessage(message);
    // console.log('mid: ', mid);
  });
});
