import { initTesting } from '../../../helper/test-util';
/*
import { runDailyJobs as _runDailyJobs_ProductsMaster } from '../../../products-master/batch';
import { runDailyJobs as _runDailyJobs_DivisionCodeMaster } from '../../../division-code-master/batch';
import { runDailyJobs as _runDailyJobs_SalesChannelMaster} from '../../../sales-channel-master/batch';
import { runDailyJobs as _runDailyJobs_Order} from '../../order/batch';
import { runDailyJobs as _runDailyJobs_Campaign} from '../../ad-campaign/batch';
import { runMonthlyJobs as _runMonthlyJobs_InventoryUnitPrice} from '../../../inventory-unit-price/batch';
import { finalizedShippingBatch } from '../../../finalized-shipping/batch';
*/
// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 注文データの実行
describe('batch of amazon advertising-fee', () => {
  it('Unit test: ', async () => {

    //---------------------------------
    //
    // スプレッドシートから取得
    //
    //---------------------------------

    /*
    // 商品マスタ（）
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

    /*
    // [c001, c002, c003] 売上確定データ（クラウドロジFBA・RSL・SEIWA）
    // await finalizedShippingBatch(new Date());
    */
    // [c004] 蔵奉行_在庫単価
    //const runMonthlyJobs_InventoryUnitPrice = wrap(_runMonthlyJobs_InventoryUnitPrice);
    //await runMonthlyJobs_InventoryUnitPrice({});
    /*
    // [c009] Amazon注文データ
    const runDailyJobs_Order = wrap(_runDailyJobs_Order);
    await runDailyJobs_Order({});
    
    // [c010] Amazonキャンペーン
    const runDailyJobs_Campaign = wrap(_runDailyJobs_Campaign);
    await runDailyJobs_Campaign({});
    */

  });
});
