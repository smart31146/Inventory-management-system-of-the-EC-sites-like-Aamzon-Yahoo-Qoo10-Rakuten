import { convertValuesToJson } from "../../helper/sheets/convertValuesToJson";
import { getValuesFromSheets } from "../../helper/sheets/getValuesFromSheets";
import { ProductMaster3Converter } from "../models/converter";
import { ProductMaster3Repository } from "../models/repository";

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタのバッチ処理
 */
//-------------------------------------------------------------------------------
export const productsMaster3Batch = async () => {
  // スプレッドシートからデータ取得
  const values = await getValuesFromSheets({
    range: "配送料マスタ（暫定）!L3:Q",
    spreadsheetId: "1reWI00hRA0QnVyuNG2HFqX8jMlB4I-sNF4ZvgMpjh_k",
  });

  // JSONデータに変換
  const jsonData = convertValuesToJson(values);

  // コンバーターにデータ設定
  const converter = new ProductMaster3Converter();
  const channels = jsonData.map((row) => converter.fromCsvRow(row));

  // バッチ作成
  const repo = new ProductMaster3Repository();
  await repo.batchCreate(channels);
};
