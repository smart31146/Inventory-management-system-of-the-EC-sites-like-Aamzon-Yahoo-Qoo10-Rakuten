import { IFinalizedSalesByProduct } from '../../finalized-sales-by-product/models/schema';
import { FinalizedSalesByProductConverter } from '../../finalized-sales-by-product/models/converter';
import { createValuesToBrandSheets } from '../../helper/sheets/createValuesToBrandSheets';
import { getEntrySheetMaster } from '../sheet/getEntrySheetMaster';
import { TestOutputSpreadSheet } from '../../api/batch/test_outputSpreadSheet';
import { SalesChannel } from '../../helper/types';
import { getSheetIdFromUrl } from '../../helper/sheets/getSheetIdFromUrl';
import { getValuesFromSheets } from '../../helper/sheets/getValuesFromSheets';
import { clearValuesFromSheets } from '../../helper/sheets/clearValuesFromSheets';
import { parseColumnAlphabet } from '../../finalized-sales-by-brand/sheet/getWriteCellPoint';
//-------------------------------------------------------------------------------
/**
 * ブランド別販売実績のスプレッドシートへ出力
 *  ※ ここでは個別の商品名を出力する
 * @param fs 最終データ
 * @param finalizedAt 出荷確定日
 * @param _sheetId 出力先スプレッドシートID
 */
//-------------------------------------------------------------------------------
export const outputClearSummarySheets = async () => {
  const entrySheetMaster = await getEntrySheetMaster('利用シート一覧!A1:E');

  await Promise.all(
    entrySheetMaster.map(async (item: any) => {
      if (!item['legend'] || !item['sheet-title'] || !item['environment'] || !item['sheet-URL'] || item['output'] === 'no') return;
      if (item['legend'] === 'A' || item['legend'] === 'C') return;

      const stg = process.env.NODE_ENV !== 'production' ? entrySheetMaster.find((e) => e['legend'] === 'B') : item['legend'] !== 'B' ? item : undefined;

      if (!stg) return;

      let leoIds = await getEntrySheetMaster(stg['sheet-title']);
      let sheetId = getSheetIdFromUrl(stg['sheet-URL']);
      const columnArr = Object.keys(leoIds[0]).map((i: string) => i).slice(3);
      const rowDatas: any = [];
      let sheetName = '';
      
      await Promise.all(
        leoIds.map(async (leoId: any, i: number) => {
          const sheetName = leoId['sheetname'];
          
          await clearValuesFromSheets(
            sheetId,
            sheetName,
            "B3"
          );

        })
      );

      columnArr.forEach((_, i) => {
        const startColumnNum = 22 + ( 20 * i );
        const startColumnAlphabet = parseColumnAlphabet( startColumnNum );

        rowDatas.push({
          range: `${sheetName}!${startColumnAlphabet}:${startColumnAlphabet}`,
          values: [[`item name${i + 1}`]],
        })
      });

      await createValuesToBrandSheets(sheetId, rowDatas);
  }));
}