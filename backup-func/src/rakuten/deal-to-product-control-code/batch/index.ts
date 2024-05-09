import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { DealToProductControlCodeConverter } from '../models/converter';
import { DealToProductControlCodeRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * 楽天：Deal参加取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenDealToProductControlCodeRun = async () => {

    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: '楽天_DEAL参加!A1:C',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new DealToProductControlCodeConverter();
    const data = jsonData.flatMap((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new DealToProductControlCodeRepository();
    await repo.batchCreate(data);
}
