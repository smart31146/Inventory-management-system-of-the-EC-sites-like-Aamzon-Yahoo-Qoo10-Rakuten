import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { RakutenAdTdaConverter } from '../models/converter';
import { RakutenAdTdaRepository } from '../models/repository';
import { IRakutenAdTdaCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：TDA広告費取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenAdTdaRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IRakutenAdTdaCsvRow[] = await getCsvFromStorage(
      'c008',
      aggeregatedAt,
      { fromLine: 18 }
    );

    // CSVデータからデータを取得
    const converter = new RakutenAdTdaConverter();
    const dates = csv.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new RakutenAdTdaRepository();
    await repo.batchCreate(dates);
}
