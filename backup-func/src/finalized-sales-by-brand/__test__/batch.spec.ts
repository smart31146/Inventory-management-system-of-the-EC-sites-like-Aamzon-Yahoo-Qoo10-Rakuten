import { describe, it, jest } from '@jest/globals';
import { initTesting } from "../../helper/test-util";
import { divisionCodeMasterBatch } from '../../division-code-master/batch';
import { finalizedShippingBatch } from '../../finalized-shipping/batch';

// タイムアウト時間を設定
jest.setTimeout(50000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
initTesting()

// バッチ実行
describe('batch of products master', () => {
    it('Unit test', async () => {
        // 商品マスタ
        //await productsMasterBatch();

        // ブランド変換マスタ
        //await divisionCodeMasterBatch();

        // 売上確定データ（c001）
        //await finalizedShippingBatch(new Date('2024-01-30'), 'c001');
    });
});