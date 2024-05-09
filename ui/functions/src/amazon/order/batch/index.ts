import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { AmazonOrderConverter } from '../models/converter';
import { AmazonOrderRepository } from '../models/repository';
import { IAmazonOrderCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * アマゾン：注文取得バッチ
 * 1日1回、毎朝6時に実行
 */
//-------------------------------------------------------------------------------
export const amazonOrdersBatch = async (aggregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IAmazonOrderCsvRow[] = await getCsvFromStorage(
      'c009',
      aggregatedAt
    );

    // CSVデータからデータを取得
    const converter = new AmazonOrderConverter();
    const data = csv.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new AmazonOrderRepository();
    await repo.batchCreate(data);
  };
