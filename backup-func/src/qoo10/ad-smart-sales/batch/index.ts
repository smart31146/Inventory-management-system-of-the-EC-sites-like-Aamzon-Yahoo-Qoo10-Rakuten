import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { Qoo10AdSmartSalesConverter } from '../models/converter';
import { Qoo10AdSmartSalesRepository } from '../models/repository';
import { IQoo10AdSmartSalesCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * スマートセールス広告取得バッチ
 */
//-------------------------------------------------------------------------------
export const qoo10AdSmartSaleRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IQoo10AdSmartSalesCsvRow[] = await getCsvFromStorage(
      'c016',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new Qoo10AdSmartSalesConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new Qoo10AdSmartSalesRepository();
    await repo.batchCreate(data);
}
