import * as functions from 'firebase-functions';

export const runTime = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 540,
  memory: '2GB',
});

export const parseAsiaTokyoTimeZone = (date: Date | number) => {
  const d = new Date(date)
  d.setHours(0,0,0,0)
  return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
}
