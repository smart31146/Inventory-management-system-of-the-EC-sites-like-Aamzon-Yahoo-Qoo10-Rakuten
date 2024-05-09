

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

export const TestOutputSpreadSheet = async (count: any, memo: any) => {
    console.log("start TestOutputSpreadSheet()");

    const ssid = '1eMLALJIrIcjoEksk1HtdpKGeX44UDqQESRma732ck5k';    // develop(販売実績)✗
    //const ssid = '12SvLbx0EndxsEQEFDDg2l_8RPe_KXVh52J23VsSMDIg';    // develop(プロダクト修正)
    //const ssid = '1p4jIW-NqOKlyeAZ2UHVKA1BYHmyiEur6ZIQYzF6G6Tc';    // release(販売実績)◯
    //const ssid = '1HWB43N1T1o86TMxfTqdQ20GTNCEu7w_MWO-xmfi1HQM';    // release(プロダクト集計)◯
    
    const newSheet = 'test';

    // Google認証情報の設定
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // クライアント情報を設定
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const params = {
        range: '' ,//'商品別デイリー',
        spreadsheetId: ssid,
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        requestBody: {
          values: ['A', 'B', 'C'],
        },
    }

    // スプレッドシートからのデータ取得を実行
    const paramSheet = {
        ...params
    }

    console.log("batchUpdate");

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: params.spreadsheetId,
        resource: {
            requests: [
                {
                    addSheet: {
                    properties: {
                      title: newSheet
                    },
                },},
            ],
        },
    })

    console.log("append");
    console.log(paramSheet);

          
    // スプレッドシートへのデータ追加
    const res = await sheets.spreadsheets.values.append({
        ...paramSheet,
        requestBody: {
            values: [[process.env.NODE_ENV, '0', '1', '2', count, memo]],
        },
        range: newSheet
    });

    console.log("end TestOutputSpreadSheet()");
}