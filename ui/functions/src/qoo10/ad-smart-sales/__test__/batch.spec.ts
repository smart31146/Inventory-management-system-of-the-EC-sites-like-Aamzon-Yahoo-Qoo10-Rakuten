import { initTesting } from '../../../helper/test-util';
//import { runDailyJobs as _runDailyJobs } from '../batch';

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 実行
describe('batch of qoo10 ad-smart-sales', () => {
  it('Unit test: ', async () => {
    //const runDailyJobs = wrap(_runDailyJobs);
    //await runDailyJobs({});
  });
});