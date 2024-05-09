import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { RakutenOrderConverter } from '../models/converter';
import { RakutenOrderRepository } from '../models/repository';
import { IRakutenOrderCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：注文取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenOrdersBatch = async (aggregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IRakutenOrderCsvRow[] = await getCsvFromStorage(
      'c005',
      aggregatedAt
    );

    // CSVデータからデータを取得
    const converter = new RakutenOrderConverter();
    const data = csv.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new RakutenOrderRepository();
    await repo.batchCreate(data);
  };
