import { convertValuesToJson } from '../../helper/sheets/convertValuesToJson';
import { getValuesFromSheets } from '../../helper/sheets/getValuesFromSheets';
import { CostMasterConverter } from '../models/converter';
import { CostMasterRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * 原価のバッチ処理
 */
//-------------------------------------------------------------------------------
export const costMasterBatch = async () => {

  // スプレッドシートからデータ取得
  const values = await getValuesFromSheets({
    range: '原価一覧!B3:Q',
    spreadsheetId: '15jHYh_PDel-UaAPXQjTp7nTVrazbwm-V52ofpO2Fmic',
  });

  // JSONデータに変換
  const jsonData = convertValuesToJson(values);

  // コンバーターにデータ設定
  const converter = new CostMasterConverter();
  const channels = jsonData.map((row) => converter.fromCsvRow(row));

  // バッチ作成
  const repo = new CostMasterRepository();
  await repo.batchCreate(channels);
};
