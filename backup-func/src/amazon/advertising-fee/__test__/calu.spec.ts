import { initTesting } from '../../../helper/test-util';
import { amazonCalculationTask } from '../../../finalized-sales-by-order/calc/tasks/amazonCalculationTask';

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 注文データの実行
describe('batch of amazon advertising-fee', () => {
  it('Unit test: ', async () => {
    //await amazonCalculationTask(new Date());
  });
});
