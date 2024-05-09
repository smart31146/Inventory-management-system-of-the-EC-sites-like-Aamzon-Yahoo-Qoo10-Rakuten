import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { RakutenAdCaConverter } from '../models/converter';
import { RakutenAdCaRepository } from '../models/repository';
import { IRakutenAdCaCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：CA広告費取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenAdCaRun = async (aggeregatedAt: Date) => {  
    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IRakutenAdCaCsvRow[] = await getCsvFromStorage(
      'c007',
      aggeregatedAt
    );

    // CSVデータからデータを取得
    const converter = new RakutenAdCaConverter();
    const date = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new RakutenAdCaRepository();
    await repo.batchCreate(date);
}
