import { convertValuesToJson } from "../../helper/sheets/convertValuesToJson";
import { getValuesFromSheets } from "../../helper/sheets/getValuesFromSheets";
import { DivisionCodeMasterConverter } from "../models/converter";
import { insertDivisionCodeMaster } from "./insertDivisionCodeMaster";

//-------------------------------------------------------------------------------
/**
 * ブランド変換マスタバッチ
 */
//-------------------------------------------------------------------------------
export const divisionCodeMasterBatch = async () => {

    // スプレットシートから商品マスタのデータを取得
    const values = await getValuesFromSheets({
        range: 'ブランド変換マスタ!A1:E',
        spreadsheetId: '1reWI00hRA0QnVyuNG2HFqX8jMlB4I-sNF4ZvgMpjh_k',
    });

    // スプレットシートからの取得データをJSONに変換
    const jsonData = convertValuesToJson(values);

    // 使用するデータだけ格納する
    const converter = new DivisionCodeMasterConverter();
    const datas = jsonData.map((row) => converter.fromCsvRow(row));

    // Firestoreへのデータ追加を行う
    await insertDivisionCodeMaster( datas );
};
