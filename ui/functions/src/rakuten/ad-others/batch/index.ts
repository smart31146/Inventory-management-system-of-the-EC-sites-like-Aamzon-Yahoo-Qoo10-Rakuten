import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { RakutenAdOthersRepository } from "../models/repository";
import { RakutenAdOthersConverter } from "../models/converter";

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費取得バッチ
 */
//-------------------------------------------------------------------------------
export const rakutenAdOthersRun = async () => {

    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: '楽天_広告宣伝費_手入力分!A1:D',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new RakutenAdOthersConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new RakutenAdOthersRepository();
    await repo.batchCreate(data);
}
