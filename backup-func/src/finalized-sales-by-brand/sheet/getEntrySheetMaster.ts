import { getValuesFromSheets } from "../../helper/sheets/getValuesFromSheets";
import { convertValuesToJson } from "../../helper/sheets/convertValuesToJson";

//-------------------------------------------------------------------------------
/**
 * ブランド別商品データの取得
 */
//-------------------------------------------------------------------------------
export const getEntrySheetMaster = async (range: string) => {

  // スプレットシートからブランド別商品データを取得
  //  - development、releaseのどちらも同じ参照先となる
  const values = await getValuesFromSheets({
    range,
    spreadsheetId: '1-3vgZbAy5SF4iDGRk6ewwcFbbfBBnQqR3sdLuhvzAN0',
  });

  // スプレットシートからの取得データをJSONに変換
  const jsonData = convertValuesToJson(values);
  return jsonData;
};