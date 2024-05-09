import { runTime } from '../../helper';
import {} from '../../rakuten/advertising-fee/calc';
import {} from '../../amazon/advertising-fee/calc';
import {} from '../../yahoo/advertising-fee/calc';
import { topics } from '../topics';
// import {} from '../../qoo10/advertising-fee/calc';

type Params = {
  /**
   * 注文日
   * 広告費データの検索に使用する
   * @required
   * @format YYYY-MM-DD
   */
  orderedAt: string;
  /**
   * 販売チャネル
   * 特定の販売チャネルのみを対象にする場合に指定する
   * @required
   */
  salesChannel?: 'rakuten' | 'amazon' | 'yahoo' | 'qoo10';
};

export const advertisingFee = runTime.pubsub
  .topic(topics.calc.advertisingFee)
  .onPublish(async (message) => {
    console.log(`on publish ${topics.calc.advertisingFee}`);
  });

export const advertisingFeeOnCall = runTime.https.onCall(
  async (data: { params: Params }) => {
    console.log(`on call ${topics.calc.advertisingFee}`);
  }
);
