import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { YahooClaimsConverter } from '../models/converter';
import { YahooClaimsRepository } from '../models/repository';
import { IYahooClaimsCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：請求明細の取得バッチ
 */
//-------------------------------------------------------------------------------
export const yahooClaimsRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IYahooClaimsCsvRow[] = await getCsvFromStorage(
      'c014',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new YahooClaimsConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new YahooClaimsRepository();
    await repo.batchCreate(data);
}
