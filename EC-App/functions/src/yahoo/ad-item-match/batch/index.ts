import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { YahooItemMatchConverter } from '../models/converter';
import { YahooItemMatchRepository } from '../models/repository';
import { IYahooItemMatchCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：アイテムマッチバッチ
 */
//-------------------------------------------------------------------------------
export const yahooAdItemRun = async (aggeregatedAt: Date) => {
    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IYahooItemMatchCsvRow[] = await getCsvFromStorage(
      'c012',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new YahooItemMatchConverter();
    const data = csv.map((row) => converter.fromCsvRow(row, aggeregatedAt));

    // バッチ作成を実行
    const repo = new YahooItemMatchRepository();
    await repo.batchCreate(data);
}
