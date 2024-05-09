import { convertValuesToJson } from '../../helper/sheets/convertValuesToJson';
import { getValuesFromSheets } from '../../helper/sheets/getValuesFromSheets';
import { SalesChannelMasterConverter } from '../models/converter';
import { SalesChannelMasterRepository } from '../models/repository';

/**
 * 販売元マスタバッチ
 */
export const salesChannelMasterBatch = async () => {
  const values = await getValuesFromSheets({
    range: '販売元マスタ!A1:AB',
    spreadsheetId: '1reWI00hRA0QnVyuNG2HFqX8jMlB4I-sNF4ZvgMpjh_k',
  });
  const jsonData = convertValuesToJson(values);
  console.log(jsonData);

  const converter = new SalesChannelMasterConverter();
  const channels = jsonData.map((row) => converter.fromCsvRow(row));

  const repo = new SalesChannelMasterRepository();
  await repo.batchCreate(channels);
};
