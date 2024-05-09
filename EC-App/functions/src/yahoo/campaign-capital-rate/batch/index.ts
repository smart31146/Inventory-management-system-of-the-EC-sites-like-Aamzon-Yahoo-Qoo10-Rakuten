import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { YahooCampaignCapitalRateConverter } from '../models/converter';
import { YahooCampaignCapitalRateRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * Yahoo：倍々ストアキャンペーン取得バッチ
 */
//-------------------------------------------------------------------------------
export const yahooCampaignCapitalRateRun = async () => {
    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: 'Yahoo_倍々ストアキャンペーン!A1:C',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new YahooCampaignCapitalRateConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new YahooCampaignCapitalRateRepository();
    await repo.batchCreate(data);
}
