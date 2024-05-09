import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { Qoo10AdCartDiscountConverter } from '../models/converter';
import { Qoo10AdCartDiscountRepository } from '../models/repository';
import { IQoo10AdCartDiscountCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：カート割引取得バッチ
 */
//-------------------------------------------------------------------------------
export const qoo10AdCartDiscountRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IQoo10AdCartDiscountCsvRow[] = await getCsvFromStorage(
      'c017',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new Qoo10AdCartDiscountConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new Qoo10AdCartDiscountRepository();
    await repo.batchCreate(data);
}
