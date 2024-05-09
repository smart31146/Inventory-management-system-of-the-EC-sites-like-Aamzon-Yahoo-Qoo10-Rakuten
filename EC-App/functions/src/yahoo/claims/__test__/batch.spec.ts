import { initTesting } from '../../../helper/test-util';
import { yahooClaimsRun } from '../batch';

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 注文データの実行
describe('batch of yahoo claims', () => {
  it('Unit test: ', async () => {
    //await yahooClaimsRun(new Date('2023-12-31UTC+9'));
  });
});
