import { describe, it, jest } from '@jest/globals';
import { initTesting } from '../../../helper/test-util';
import { qoo10OrdersBatch } from '../batch';

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
initTesting();

// 注文データの実行
describe('batch of qoo10 order', () => {
  it('Unit test: ', async () => {
    //await qoo10OrdersBatch();
  });
});
