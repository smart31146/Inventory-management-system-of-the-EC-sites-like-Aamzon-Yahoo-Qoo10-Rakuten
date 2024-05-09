import { format } from "date-fns";

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
export const createValuesToSheets = async (params: AppendValuesParams,  newSheet: Date) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // クライアント情報を設定
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  // スプレッドシートからのデータ取得を実行
  const paramSheet = {
    ...params
  }

  //===============================================================
  //
  // スプレッドシートへの反映の流れ
  //  * スプレッドシートからデータ取得
  //  * 取得後にスプレッドシートのデータを更新
  //  * 更新中にエラーが起きたらスプレッドシートにデータを追加をする
  //
  //===============================================================

  //シート名の設定 
  const newSheetTitle = format(newSheet, 'yyyyMMdd');
  
  // スプレッドシートからデータ取得
  return sheets.spreadsheets.get({
    spreadsheetId:  params.spreadsheetId,
    ranges: [newSheetTitle],  
  })
  // スプレッドシートからのデータ取得後
  .then(async () => {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: params.spreadsheetId,
      range: newSheetTitle,
    });
    await sheets.spreadsheets.values.update({
      ...paramSheet,
      range:newSheetTitle,
      requestBody: undefined,
      resource:{
          values: [["出荷確定日",	"在庫ID",	"マスタID", "販売元コード",	"販売チャネル",	"部門コード",	"部門名",	"商品名",	"単価", "定価", "税率",	"販売数量",	"注文数",	"売上",	"原価",	"送料",	"手数料",	"広告費",	"一次利益", "一次利益率", "広告費率", "販管費", "平均顧客単価", "平均顧客一次利益", "平均購入個数", "クリック数", "広告経由CV", "広告経由CVR", "CPC", "CPA", "ROAS", "広告経由売上"],...paramSheet.requestBody.values],
      }
    });
  })
  // エラーが起きた場合
  .catch(async () => {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: params.spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: newSheetTitle
              },
            },
          },
        ],
      },
    })
    
    // スプレッドシートへのデータ追加
    await sheets.spreadsheets.values.append({
      ...paramSheet,
      requestBody: {
        values: [["出荷確定日",	"在庫ID",	"マスタID", "販売元コード",	"販売チャネル",	"部門コード",	"部門名",	"商品名",	"単価", "定価", "税率",	"販売数量",	"注文数",	"売上",	"原価",	"送料",	"手数料",	"広告費",	"一次利益", "一次利益率", "広告費率", "販管費", "平均顧客単価", "平均顧客一次利益", "平均購入個数", "クリック数", "広告経由CV", "広告経由CVR", "CPC", "CPA", "ROAS", "広告経由売上"],...paramSheet.requestBody.values],
      },
      range: newSheetTitle
    });
  });
};
