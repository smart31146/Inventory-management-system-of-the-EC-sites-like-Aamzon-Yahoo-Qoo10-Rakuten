import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { RakutenAdRppConverter} from '../models/converter';
import { RakutenAdRppRepository } from '../models/repository';
import { IRakutenAdRppCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * 楽天：RPP注文広告費バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenAdRppRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    //  - CSVファイルの7行目から読み取り開始する
    const csv: IRakutenAdRppCsvRow[] = await getCsvFromStorage(
      'c006',
      aggeregatedAt,
      { fromLine: 7 }
    );

    // CSVデータからデータを取得
    const converter = new RakutenAdRppConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new RakutenAdRppRepository();
    await repo.batchCreate(data);
}
