import { describe, it, jest } from '@jest/globals';
import { parse } from 'date-fns';
import { initTesting } from '../../../helper/test-util';
import { rakutenOrdersBatch } from '../batch';
import { ja } from 'date-fns/locale';

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
initTesting();

// 注文データの実行
describe('batch of rakuten order', () => {
  it('Unit test', async () => {
    // await rakutenOrdersBatch();
    // const test = parse("12/9/2023", "MM/dd/yyyy", new Date(), {locale: ja}).getTime();
    // const test2 = parse("12/9/2023", "MM/dd/yyyy", new Date()).getTime();
    // console.log(test);
    // console.log(test2);
  });
});
