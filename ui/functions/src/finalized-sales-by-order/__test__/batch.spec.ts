import { describe, it, jest } from '@jest/globals';
import { initTesting } from "../../helper/test-util";
import { divisionCodeMasterBatch } from '../../division-code-master/batch';
import { salesChannelMasterBatch } from '../../sales-channel-master/batch';
import { finalizedShippingBatch } from '../../finalized-shipping/batch';
import { inventoryUnitPriceBatch } from '../../inventory-unit-price/batch'; 
import { rakutenAdOthersRun } from '../../rakuten/ad-others/batch';
import { amazonOrdersBatch } from '../../amazon/order/batch';

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

        // 販売チャンネル
        //await salesChannelMasterBatch();

        // 売上確定データ（c009）
        //await finalizedShippingBatch(new Date('2024-01-17'), 'c009');

        // 在庫単価同期（c004）
        //await inventoryUnitPriceBatch(new Date('2024/01/17'));

        // rakuten-orders
        //await rakutenAdOthersRun();

        // amazon orders（c009）
        //await amazonOrdersBatch(new Date('2024-01-17'));
    });
});