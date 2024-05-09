import { convertValuesToJson } from "../../helper/sheets/convertValuesToJson";
import { getValuesFromSheets } from "../../helper/sheets/getValuesFromSheets";
import { ProductMaster2Converter } from "../models/converter";
import { ProductMaster2Repository } from "../models/repository";

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタのバッチ処理
 */
//-------------------------------------------------------------------------------
export const productsMaster2Batch = async () => {

  // スプレッドシートからデータ取得
  const values = await getValuesFromSheets({
    range: "【販売管理】商品コードマスタ!B4:AI",
    spreadsheetId: "1reWI00hRA0QnVyuNG2HFqX8jMlB4I-sNF4ZvgMpjh_k",
  });

  // JSONデータに変換
  const jsonData = convertValuesToJson(values);

  // コンバーターにデータ設定
  const converter = new ProductMaster2Converter();
  const channels = jsonData.map((row) => converter.fromCsvRow(row));

  // バッチ作成
  const repo = new ProductMaster2Repository();
  await repo.batchCreate(channels);
};
