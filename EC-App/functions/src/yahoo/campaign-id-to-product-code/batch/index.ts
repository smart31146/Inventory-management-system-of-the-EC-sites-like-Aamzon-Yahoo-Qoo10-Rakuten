import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { YahooCampaignIdToProductCodeConverter } from '../models/converter';
import { YahooCampaignIdToProductCodeRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンID取得バッチ
 */
//-------------------------------------------------------------------------------
export const yahooCampaignIdCodeRun = async () => {
    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: 'Yahoo_キャンペーンID!A1:C',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new YahooCampaignIdToProductCodeConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row)).flat();

    // バッチ作成を実行
    const repo = new YahooCampaignIdToProductCodeRepository();
    await repo.batchCreate(data);
}
