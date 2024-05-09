import { initTesting } from '../../../helper/test-util';
/*
import { runDailyJobs as _runDailyJobs_ProductsMaster } from '../../../products-master/batch';
import { runDailyJobs as _runDailyJobs_DivisionCodeMaster } from '../../../division-code-master/batch';
import { runDailyJobs as _runDailyJobs_SalesChannelMaster} from '../../../sales-channel-master/batch';
import { runDailyJobs as _runDailyJobs_Order} from '../../order/batch';
import { runMonthlyJobs as _runMonthlyJobs_InventoryUnitPrice} from '../../../inventory-unit-price/batch';
*/
import { finalizedShippingBatch } from '../../../finalized-shipping/batch';
/*
import { runDailyJobs as _runDailyJobs_AdOther} from '../../ad-others/batch';
import { runDailyJobs as _runDailyJobs_ItemMatchShipping } from '../../ad-item-match/batch';
import { runDailyJobs as _runDailyJobs_MakerItemMatch } from '../../ad-maker-item-match/batch';
import { runDailyJobs as _runDailyJobs_CampaignIdToProductCode } from '../../campaign-id-to-product-code/batch';
import { runDailyJobs as _runDailyJobs_CampaignCapitalRate } from '../../campaign-capital-rate/batch';
import { runDailyJobs as _runDailyJobs_Claims } from '../../claims/batch';
*/

// タイムアウト時間を設定
jest.setTimeout(120000);

// テスト時のプロジェクト名を設定
// プロジェクト名は関数の参照先で初期化している
const { wrap } = initTesting();

// 実行
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

    // Yahoo広告宣伝費_手入力分マスタ
    const runDailyJobs_AdOther = wrap(_runDailyJobs_AdOther);
    await runDailyJobs_AdOther({});

    // YahooキャンペーンIDマスタ
    const runDailyJobs_CampaignIdToProductCode = wrap(_runDailyJobs_CampaignIdToProductCode);
    await runDailyJobs_CampaignIdToProductCode({});

    // Yahoo倍々ストアキャンペーン
    const runDailyJobs_CampaignCapitalRate = wrap(_runDailyJobs_CampaignCapitalRate);
    await runDailyJobs_CampaignCapitalRate({});
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
    */
    // [c011] Yahoo注文データ
    //const runDailyJobs_Order = wrap(_runDailyJobs_Order);
    //await runDailyJobs_Order({});
    /*
    // [c012] Yahooアイテムマッチ
    const runDailyJobs_Campaign = wrap(_runDailyJobs_ItemMatchShipping);
    await runDailyJobs_Campaign({});

    // [c013] Yahooメーカーアイテムマッチ
    const runDailyJobs_MakerItemMatch = wrap(_runDailyJobs_MakerItemMatch);
    await runDailyJobs_MakerItemMatch({});
    
    // [c014] Yahoo請求明細
    const runDailyJobs_Claims = wrap(_runDailyJobs_Claims);
    await runDailyJobs_Claims({});
    */
  });
});
