import { getValuesFromSheets } from "../../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../../helper/sheets/convertValuesToJson";
import { YahooAdOthersRepository } from '../models/repository';
import { YahooAdOthersConverter } from '../models/converter';

//-------------------------------------------------------------------------------
/**
 * Yahoo：広告宣伝費取得バッチ
 */
//-------------------------------------------------------------------------------
export const yahooAdOthersRun = async () => {
    // スプレットシートからデータを取得
    const values = await getValuesFromSheets({
        range: 'Yahoo_広告宣伝費_手入力分!A1:D',
        spreadsheetId: '1oxdXAHUvtBiNNXTNld7oA_X1YZSV3IvGJiexLb7gmbo',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new YahooAdOthersConverter();
    const data = jsonData.map((row) => converter.fromCsvRow(row));

    // バッチ作成を実行
    const repo = new YahooAdOthersRepository();
    await repo.batchCreate(data);
}
