import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { AmazonCampaignToAsinConverter } from '../models/converter';
import { AmazonCampaignToAsinRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * Amazon：キャンペーン取得バッチ
 */
//-------------------------------------------------------------------------------
export const amazonCampaignToAsinRun = async () => {
    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: 'Amazon_キャンペーン!A1:D',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new AmazonCampaignToAsinConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new AmazonCampaignToAsinRepository();
    await repo.batchCreate(data);
}
