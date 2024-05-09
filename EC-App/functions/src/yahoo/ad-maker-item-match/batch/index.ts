import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { YahooMakerItemMatchConverter } from '../models/converter';
import { YahooMakerItemMatchRepository } from '../models/repository';
import { IYahooMakerItemMatchCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：メーカーアイテムマッチバッチ
 */
//-------------------------------------------------------------------------------
export const yahooAdMakerItemRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IYahooMakerItemMatchCsvRow[] = await getCsvFromStorage(
      'c013',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new YahooMakerItemMatchConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new YahooMakerItemMatchRepository();
    await repo.batchCreate(data);
}
