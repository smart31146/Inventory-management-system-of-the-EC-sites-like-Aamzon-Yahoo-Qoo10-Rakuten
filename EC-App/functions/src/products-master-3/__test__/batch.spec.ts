import { describe, it, jest } from '@jest/globals';
import { initTesting } from "../../helper/test-util";
import { productsMaster3Batch } from '../batch';

// タイムアウト時間を設定
jest.setTimeout(15000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
initTesting()

// 商品マスタの実行
describe('batch of products master 3', () => {
    it('Unit test', async () => {
        // await productsMaster2Batch();
    });
});