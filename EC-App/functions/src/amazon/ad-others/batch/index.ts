import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { AmazonAdOthersRepository } from '../models/repository';
import { AmazonAdOthersConverter } from '../models/converter';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費_手入力分取得バッチ
 */
//-------------------------------------------------------------------------------
export const amazonAdOthersRun = async () => {

    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: 'Amazon_広告宣伝費_手入力分!A1:D',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new AmazonAdOthersConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new AmazonAdOthersRepository();
    await repo.batchCreate(data);
}
