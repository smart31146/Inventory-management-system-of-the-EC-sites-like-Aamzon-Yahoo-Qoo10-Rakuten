import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { Qoo10OrderConverter } from '../models/converter';
import { Qoo10OrderRepository } from '../models/repository';
import { IQoo10OrderCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：注文取得バッチ
 * 1日1回、毎朝6時に実行
 */
//-------------------------------------------------------------------------------
export const qoo10OrdersBatch = async (aggregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IQoo10OrderCsvRow[] = await getCsvFromStorage(
      'c015',
      aggregatedAt
    );

    // CSVデータからデータを取得
    const converter = new Qoo10OrderConverter();
    const data = csv.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new Qoo10OrderRepository();
    await repo.batchCreate(data);
  };
