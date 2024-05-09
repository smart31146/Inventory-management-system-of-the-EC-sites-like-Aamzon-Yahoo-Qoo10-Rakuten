import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { AmazonAdCampaignConverter } from '../models/converter';
import { AmazonAdCampaignRepository } from '../models/repository';
import { IAmazonAdCampaignCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンバッチ
 */
//-------------------------------------------------------------------------------
export const amazonAdCampaignRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IAmazonAdCampaignCsvRow[] = await getCsvFromStorage(
      'c010',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new AmazonAdCampaignConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new AmazonAdCampaignRepository();
    await repo.batchCreate(data);
}
