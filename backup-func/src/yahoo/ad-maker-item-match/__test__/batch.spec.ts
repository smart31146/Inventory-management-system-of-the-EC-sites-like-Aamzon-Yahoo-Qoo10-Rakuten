import { initTesting } from '../../../helper/test-util';
//import { runDailyJobs as _runDailyJobs } from '../batch';
import { yahooAdMakerItemRun } from '../batch'

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 実行
describe('batch of yahoo ad-maker-item-match', () => {
  it('Unit test: ', async () => {
    //await yahooAdMakerItemRun(new Date('2024-03-01'));
  });
});
