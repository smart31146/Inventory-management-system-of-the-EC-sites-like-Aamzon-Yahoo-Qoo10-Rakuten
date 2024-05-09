import { appendValuesToSheets } from '../../helper/sheets/appendValuesToSheets';
import { createValuesToSheets } from '../../helper/sheets/createValuesToSheets';
import { FinalizedSalesByProductConverter } from '../models/converter';
import { IFinalizedSalesByProduct } from '../models/schema';
import { TestOutputSpreadSheet } from '../../api/batch/test_outputSpreadSheet';
import { getEntrySheetMaster } from '../../finalized-sales-by-brand/sheet/getEntrySheetMaster';
import { getSheetIdFromUrl } from '../../helper/sheets/getSheetIdFromUrl';

/**
 * 商品別販売実績をスプレッドシートへ出力
 * @param fs 最終データ
 * @param finalizedAt 出荷確定日
 * @param _sheetId 出力先スプレッドシートID
 */
export const outputFinalizedSalesToSheet = async ({
  fs,
  finalizedAt,
}: {
  fs: IFinalizedSalesByProduct[];
  finalizedAt: Date;
}) => {

  let cnt = 0;

  // コンバータの取得
  const converter = new FinalizedSalesByProductConverter();

  // コンバータに採集データの値を設定
  const finalizedSales = fs.map((entity) => {
    return converter.toSheetRow(entity);
  });

  // 日付配列を作成
  // row[0]は日付が格納されているからそれだけを指定して取得
  const dateArr = finalizedSales.map(row => row[0])

  // 結果配列を作成
  // 日付データを繰り返し、最終データの中から一致する日付のデータを配列に格納
  const formattedDate = new Date(finalizedAt);
  const dates = Array.from(new Set(dateArr)).filter((date) => date === `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear()}`);

  const resultObj : any = {}
  dates.forEach(date => {
    resultObj[date] = finalizedSales.filter(row => row[0] == date)
  })

  // シートIDの有無によって使用するスプレッドシートIDを設定
  //  - unknown：development、staging
  //  - それ以外：release
  const entrySheetMaster = await getEntrySheetMaster('利用シート一覧!A1:E');
  const sheetId = process.env.NODE_ENV !== 'production' ? getSheetIdFromUrl(entrySheetMaster.find((e) => e['legend'] === 'A' && e['output'] === 'yes' )['sheet-URL']) : getSheetIdFromUrl(entrySheetMaster.find((e) => e['legend'] === 'C' && e['output'] === 'yes' )['sheet-URL']);

  // 同期的に最終結果をスプレッドシートに記入する
  // もしシートが存在しなければ作成もする
  await Promise.all(Object.keys(resultObj).map(async date => {
    await createValuesToSheets(
      {
        range: '' ,//'商品別デイリー',
        spreadsheetId: sheetId,
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        requestBody: {
          values: [...resultObj[date]],
        },
      },
      new Date(date)!
    );

    cnt++;
  }))

  // デバッグ用
  //await TestOutputSpreadSheet(cnt, sheetId);
};
