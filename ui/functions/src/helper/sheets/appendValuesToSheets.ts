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
export const appendValuesToSheets = async (params: AppendValuesParams) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // クライアント情報を設定
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  // スプレッドシートからのデータ取得を実行
  const res = await sheets.spreadsheets.values.append({
    ...params,
  });

  // スプレッドシートからの取得内容を返却
  return res.data.values;
};
