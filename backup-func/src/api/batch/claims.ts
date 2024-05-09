import { runTime } from '../../helper';
import {} from '../../yahoo/claims/batch';
import { topics } from '../topics';

export const claims = runTime.pubsub
  .topic(topics.batch.claims)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.batch.claims}`);
  });

export const claimsOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.batch.claims}`);
});
