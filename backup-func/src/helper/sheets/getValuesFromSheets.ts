const { google } = require('googleapis');
const sheets = google.sheets('v4');

//-------------------------------------------------------------------------------
/**
 * 引数に使うパラメータの定義
 */
//-------------------------------------------------------------------------------
type GetValuesParams = {
  spreadsheetId: string;
  range: string;
  dateTimeRenderOption?: string;
  majorDimension?: string;
  valueRenderOption?: string;
};

//-------------------------------------------------------------------------------
/**
 * スプレッドシートからデータ取得
 *  - 引数で「スプレッドシートID、シート名と取得範囲」を設定する。
 * @param spreadsheetId スプレッドシートID
 * @param range シート名と取得範囲（例)シート1!A3:AW
 * @returns スプレッドデータから取得したデータ
 */
//-------------------------------------------------------------------------------
export const getValuesFromSheets = async ({
  spreadsheetId,
  range,
  ...others
}: GetValuesParams) => {

  // Google認証情報の設定
  // 取得内容
  //  - Googleスプレッドシートの読込みのみ
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  // クライアント情報を設定
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  // スプレッドシートからのデータ取得を実行
  const res = await sheets.spreadsheets.values.get({
    range,
    spreadsheetId,
    ...others,
  });

  // スプレッドシートからの取得内容を返却
  return res.data.values;
};
