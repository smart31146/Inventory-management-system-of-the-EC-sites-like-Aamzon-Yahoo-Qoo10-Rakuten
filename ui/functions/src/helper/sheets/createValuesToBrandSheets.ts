const { google } = require('googleapis');
const sheets = google.sheets('v4');

//-------------------------------------------------------------------------------
export type SummaryData = {
  range: string;
  majorDimension?: string;
  values: any[][];
}

//-------------------------------------------------------------------------------
/**
 * ブランド別実績販売スプレッドシートへのデータ追加
 * @param params パラメータ
 * @param newSheet シート名（ブランド名を設定する）
 * @returns 
 */
//-------------------------------------------------------------------------------
export const createValuesToBrandSheets = async (spreadsheetId: string, data: SummaryData[]) => {

  // Google認証情報の設定
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // クライアント情報を設定
  const authClient = await auth.getClient();
  google.options({ auth: authClient });


  //===============================================================
  //
  // スプレッドシートへの反映の流れ
  //  * スプレッドシートからデータ取得
  //  * 取得後にスプレッドシートのデータを更新
  //  * 取得時にエラーが起きたら、シートを新規作成してデータを追加をする
  //
  //===============================================================

  // スプレッドシートへのデータ追加
  return sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: {
      valueInputOption: "RAW",
      data: data.map((e: SummaryData) => ({
        ...e,
        majorDimension: "ROWS",
      })),
    },
  });
};
