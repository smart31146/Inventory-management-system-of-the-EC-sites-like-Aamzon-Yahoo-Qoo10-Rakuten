import { initTesting } from '../../../helper/test-util';
/*
import { runDailyJobs as _runDailyJobs_ProductsMaster } from '../../../products-master/batch';
import { runDailyJobs as _runDailyJobs_DivisionCodeMaster } from '../../../division-code-master/batch';
import { runDailyJobs as _runDailyJobs_SalesChannelMaster } from '../../../sales-channel-master/batch';
import { runMonthlyJobs as _runMonthlyJobs_InventoryUnitPrice } from '../../../inventory-unit-price/batch';
*/
/*
import { runDailyJobs as _runDailyJobs_Order } from '../../order/batch';
import { runDailyJobs as _runDailyJobs_CartDiscount } from '../../ad-cart-discount/batch';
import { runDailyJobs as _runDailyJobs_PromotionSettlement } from '../../ad-promotion-settlement/batch';
*/
import { finalizedShippingBatch } from '../../../finalized-shipping/batch';


// /Users/work/Git/lsctfront-org/kms-api/functions/src/finalized-shipping/batch/index.ts
// /Users/work/Git/lsctfront-org/kms-api/functions/kms-api/functions/src/finalized-shipping/batch/index.ts
// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 実行
describe('batch of qoo10 add-advertising-fee', () => {
  it('Unit test: ', async () => {

    //---------------------------------
    //
    // スプレッドシートから取得
    //
    //---------------------------------

    /*
    // 商品マスタ
    const runDailyJobs_ProductsMaster = wrap(_runDailyJobs_ProductsMaster);
    await runDailyJobs_ProductsMaster({});

    // ブランド変換マスタ
    const runDailyJobs_DivisionCodeMaster = wrap(_runDailyJobs_DivisionCodeMaster);
    await runDailyJobs_DivisionCodeMaster({});
    
    // 販売元マスタ
    const runDailyJobs_SalesChannelMaster = wrap(_runDailyJobs_SalesChannelMaster);
    await runDailyJobs_SalesChannelMaster({});
    */

    //---------------------------------
    //
    // CSVファイルから取得
    //
    //---------------------------------

    // [c001, c002, c003] 売上確定データ（クラウドロジFBA・RSL・SEIWA）
    //await finalizedShippingBatch(new Date());

    /*
    // [c004] 蔵奉行_在庫単価
    const runMonthlyJobs_InventoryUnitPrice = wrap(_runMonthlyJobs_InventoryUnitPrice);
    await runMonthlyJobs_InventoryUnitPrice({});
    
    // [c009] Qoo10注文データ（販売詳細内訳）
    const runDailyJobs_Order = wrap(_runDailyJobs_Order);
    await runDailyJobs_Order({});
    
    // [c017] Qoo10カート割引
    const runDailyJobs_CartDiscount = wrap(_runDailyJobs_CartDiscount);
    await runDailyJobs_CartDiscount({});

    // [c018] Qoo10プロモーション精算内訳
    const runDailyJobs_PromotionSettlement = wrap(_runDailyJobs_PromotionSettlement);
    await runDailyJobs_PromotionSettlement({});
    */
  });
});