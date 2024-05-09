import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { AmazonAdsKpiConverter } from '../models/converter';
import { AmazonAdsKpiRepository } from '../models/repository';
import { IAmazonAdsKpiCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンバッチ
 */
//-------------------------------------------------------------------------------
export const amazonAdsKpiRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IAmazonAdsKpiCsvRow[] = await getCsvFromStorage(
      'c019',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const date = new Date(aggeregatedAt);
    date.setHours(0, 0, 0, 0);
    const parseDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const converter = new AmazonAdsKpiConverter();
    const data = csv.map((row) => converter.fromCsvRow({ ...row, date: parseDate.getTime() })).flat();

    // バッチ作成を実行
    const repo = new AmazonAdsKpiRepository();
    await repo.batchCreate(data);
}
