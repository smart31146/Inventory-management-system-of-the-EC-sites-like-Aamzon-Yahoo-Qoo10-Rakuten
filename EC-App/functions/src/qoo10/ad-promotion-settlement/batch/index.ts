import { getCsvFromStorage } from '../../../helper/storage/getCsvFromStorage';
import { Qoo10AdPromotionSettlementConverter } from '../models/converter';
import { Qoo10AdPromotionSettlementRepository } from '../models/repository';
import { IQoo10AdPromotionSettlementCsvRow } from '../models/schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：プロモーション精算内訳取得バッチ
 */
//-------------------------------------------------------------------------------
export const qoo10AdPromotionRun = async (aggeregatedAt: Date) => {

    // FireStorageからCSVデータの取得
    //  - 取得するCSVのIDを渡す
    //  - ファイル名の検索で使う日付を渡す
    const csv: IQoo10AdPromotionSettlementCsvRow[] = await getCsvFromStorage(
      'c018',
      aggeregatedAt,
    );

    // CSVデータからデータを取得
    const converter = new Qoo10AdPromotionSettlementConverter();
    const data = csv.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new Qoo10AdPromotionSettlementRepository();
    await repo.batchCreate(data);
}
