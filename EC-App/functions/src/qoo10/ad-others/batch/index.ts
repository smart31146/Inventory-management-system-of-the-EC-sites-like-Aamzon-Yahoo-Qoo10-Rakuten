import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { Qoo10AdOthersConverter } from '../models/converter';
import { Qoo10AdOthersRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分取得バッチ
 */
//-------------------------------------------------------------------------------
export const qoo10AdOthersRun = async () => {

    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
      range: 'Qoo10_広告宣伝費_手入力分!A1:D',
      spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new Qoo10AdOthersConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new Qoo10AdOthersRepository();
    await repo.batchCreate(data);
}
