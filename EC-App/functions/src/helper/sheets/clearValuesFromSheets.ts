import { format } from "date-fns";
import { parseColumnAlphabet } from "../../finalized-sales-by-brand/sheet/getWriteCellPoint";

const { google } = require('googleapis');
const sheets = google.sheets('v4');

type AppendValuesParams = {
  spreadsheetId: string;
  range: string;
  valueInputOption: 'RAW' | 'USER_ENTERED';
  insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS';
  requestBody?: any;
  includeValuesInResponse?: boolean;
  responseValueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA';
  responseDateTimeRenderOption?: 'SERIAL_NUMBER' | 'FORMATTED_STRING';
};

/**
 * スプレッドシートへのデータ追加
 * @param params 
 * @returns 
 */



export const clearValuesFromSheets = async (spreadsheetId: string, sheetTitle: string, startRowColumn: string) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // クライアント情報を設定
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const lastColumn = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
    ranges: [`${sheetTitle}!1:1`],
    fields: 'sheets.properties.gridProperties.columnCount',
  });
  const columnCount = lastColumn.data.sheets[0].properties.gridProperties.columnCount;
  const range = `${sheetTitle}!${startRowColumn}:${parseColumnAlphabet(columnCount)}`;

  return await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: range,
  });
  
  // // スプレッドシートからデータ取得
  // return sheets.spreadsheets.get({
  //   spreadsheetId:  spreadsheetId,
  //   ranges: sheetTitle,  
  // })
  // // スプレッドシートからのデータ取得後
  // .then(async () => {
  //   const lastColumn = await sheets.spreadsheets.get({
  //       spreadsheetId: spreadsheetId,
  //       ranges: [`${sheetTitle}!1:1`],
  //       fields: 'sheets.properties.gridProperties.columnCount',
  //   });
  //   const columnCount = lastColumn.data.sheets[0].properties.gridProperties.columnCount;
  //   const range = `${sheetTitle}!${startRowColumn}:${parseColumnAlphabet(columnCount)}`;
    
  //   await sheets.spreadsheets.values.clear({
  //       spreadsheetId: spreadsheetId,
  //       range: range,
  //   });
  // })
};
