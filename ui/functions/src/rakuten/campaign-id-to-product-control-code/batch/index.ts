import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { RakutenCampaignIdToProductControlCodeRepository } from '../model/repository';
import { RakutenCampaignIdToProductControlCodeConverter } from '../model/converter';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenCampaignIdCodeRun = async () => {

    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: '楽天_キャンペーンID!A1:B',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new RakutenCampaignIdToProductControlCodeConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new RakutenCampaignIdToProductControlCodeRepository();
    await repo.batchCreate(data);
}
