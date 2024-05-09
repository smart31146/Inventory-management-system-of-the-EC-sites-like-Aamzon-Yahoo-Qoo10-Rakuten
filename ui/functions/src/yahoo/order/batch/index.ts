import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { YahooOrderConverter } from '../models/converter';
import { YahooOrderRepository } from '../models/repository';
import { IYahooOrderCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Yahoo：注文取得バッチ
 */
//-------------------------------------------------------------------------------
export const yahooOrdersBatch = async (aggregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IYahooOrderCsvRow[] = await getCsvFromStorage(
      'c011',
      aggregatedAt
    );

    // CSVデータからデータを取得
    const converter = new YahooOrderConverter();
    const data = csv.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new YahooOrderRepository();
    await repo.batchCreate(data);
  };
