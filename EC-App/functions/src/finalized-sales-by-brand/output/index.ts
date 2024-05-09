import { IFinalizedSalesByProduct } from '../../finalized-sales-by-product/models/schema';
import { FinalizedSalesByProductConverter } from '../../finalized-sales-by-product/models/converter';
import { SummaryData, createValuesToBrandSheets } from '../../helper/sheets/createValuesToBrandSheets';
import { IFinalizedSalesByBrand } from '../models/schema';
import { FinalizedSalesByBrandConverter } from '../models/converter';
import { getEntrySheetMaster } from '../sheet/getEntrySheetMaster';
import { getWriteCellPoint, parseColumnAlphabet } from '../sheet/getWriteCellPoint';
import { getSheetIdFromUrl } from '../../helper/sheets/getSheetIdFromUrl';
//-------------------------------------------------------------------------------
/**
 * ブランド別販売実績のスプレッドシートへ出力
 *  ※ ここでは個別の商品名を出力する
 * @param fs 最終データ
 * @param finalizedAt 出荷確定日
 * @param _sheetId 出力先スプレッドシートID
 */
//-------------------------------------------------------------------------------
export const outputFinalizedSalesBrandOfProductToSheet = async ({
  fs,
  finalizedAt,
}: {
  fs: IFinalizedSalesByProduct[];
  finalizedAt: Date;
}) => {
  //==========================================
  //
  // スプシからブランド別商品データの取得
  //
  //==========================================

  // スプレッドシートからブランド別商品データの取得
  // スプレッドシートに出力する位置を決めるのに使用する
  const entrySheetMaster = await getEntrySheetMaster('利用シート一覧!A1:E');

  //==========================================
  //
  // 商品名ごとに分けてデータを格納
  //
  //==========================================
    
  // 商品別販売実績のコンバータを取得
  const productConverter = new FinalizedSalesByProductConverter();
  const brandConverter = new FinalizedSalesByBrandConverter();

  // 作成したコンバータに最終データの値を設定
  const finalizedSales = fs.map((entity) => {
      return productConverter.toSheetRow(entity);
  });

  // 商品名の配列を作成
  // 最終結果から商品名だけを取得して配列に格納する
  //  - row[1]: inventoryID/sku
  const skuArr = finalizedSales
    .map((row) => row[1])
    .filter((item) => item !== 0);

  // 商品名の配列を整理
  const flatsku = Array.from(new Set(skuArr));

  // 商品名ごとに分けた配列を作成
  // 商品名データを繰り返し、最終データの中から一致する商品名のデータを配列に格納
  const resultProductObj : any = {};
  flatsku.forEach((result) => {
    resultProductObj[result] = finalizedSales.filter( (row: any) => row[1] == result && row[0] ==  `${finalizedAt.getMonth() + 1}/${finalizedAt.getDate()}/${finalizedAt.getFullYear()}`);
  })


  const baseDate = new Date('2024/01/01');
  
  // ベース日付との差分を出す
  // 86,400,000ミリ秒 = 24時間*60分*60秒*1000ミリ秒
  const diffTime = finalizedAt.getTime() - baseDate.getTime();
  const onDayMilliSecond = 24 * 60 * 60 * 1000;
  const diffDayCOunt = Math.floor( diffTime / onDayMilliSecond );
  const startRowPoint = 3;    
  // スプレッドシートへ書き込む行の場所を設定
  // A列に書かれた日付に合わせて出力したいから日付分を加算する
  const writeRow = startRowPoint + diffDayCOunt;
  //-------------------------
  // 商品名のループ
  //-------------------------

  // 商品名で繰り返す
  // 商品名別に日付で分けて持つようにする
  await Promise.all(
    entrySheetMaster.map(async (item: any) => {
      if (!item['legend'] || !item['sheet-title'] || !item['environment'] || !item['sheet-URL'] || item['output'] === 'no') return;
      if (item['legend'] === 'A' || item['legend'] === 'C') return;

      const stg = process.env.NODE_ENV !== 'production' ? entrySheetMaster.find((e) => e['legend'] === 'B') : item['legend'] !== 'B' ? item : undefined;
      
      if (!stg) return;

      let skus = await getEntrySheetMaster(stg['sheet-title']);
      let sheetId = getSheetIdFromUrl(stg['sheet-URL']);
      const columnArr = Object.keys(skus[0]).map((i: string) => i).slice(3);
      const rowDatas: SummaryData[] = [];
      const totalRowDatas: {
        [sheetName: string]: (string | number)[][]
      } = {}
      const rowEmptyDatas: SummaryData[] = [];
      for( let row = 0; row < skus.length; row++ )
        {
          let writeOrder = 0;
          let sheetName = "";
          let columnName = "";
          // ブランド別商品データの列を繰り返す
          for( let col = 1; col < 50; col++ )
          {

            // カラム名リストからカラム名を取得
            columnName = columnArr[col];
           
            // 結果データにブランド別商品データの商品名があるか判定
            // ブランド別商品データで使用するのは「種類」と書かれたカラムとなる
          
              // 出力時の順番を設定
              // 出力するシート名を設定
              // ループからに受ける
              writeOrder = col;
              sheetName = skus[row]['sheetname'];

              //-------------------------
              // 出力セル位置を設定
              //-------------------------

              // Item Name
              const startColumnNum = 22 + ( 20 * writeOrder);
              const startColumnAlphabet = parseColumnAlphabet( startColumnNum );
              const itemName = `item_name_${col}`;
              const itemNameRange = `${startColumnAlphabet}:${startColumnAlphabet}`;
                       
            
              rowEmptyDatas.push({
                range: `${sheetName}!${itemNameRange}`,
                values: [[itemName]],
              })
          
            
          }
        }
      await createValuesToBrandSheets(sheetId, rowEmptyDatas);
      Object.keys(resultProductObj).forEach((result: any) => {
        const flatDates = Array.from(new Set(resultProductObj[result].map((row: any) => row[0])));
        flatDates.forEach((date : any) => {
          skus.forEach((leoId: any) => {
            // 日付ごとでデータを分ける
            const dateDatas = resultProductObj[result].filter((row: any) => row[0] == date && row[4] == leoId['shop']);

            if (dateDatas.length === 0) return;

            // 中間データ
            const intermediate: {
              [key: string]: IFinalizedSalesByBrand;
            } = {}

            // keyの作成
            const key = result + "_" + date;

            //-------------------------
            // 同じ日付のデータ集約
            //-------------------------

            // 指定した日付にあるデータを繰り返して値を集約する
            dateDatas.forEach((d: any) => {              
              // 既にkeyで指定した内容に設定があるか判定
              if( intermediate[key] )
              {
                // 既にある場合は集約
                intermediate[key].quantity += d[11];
                intermediate[key].salesAmount += d[13] ; // 売上
                intermediate[key].inventoryTotalPrice += d[14]; // 原価
                intermediate[key].shippingFee += d[15]; // 送料
                intermediate[key].commissionFee += d[16]; // 手数料
                intermediate[key].advertisingFeeTotal += d[17]; // 広告費
                intermediate[key].profitAmount += d[18]; // 一次利益
                intermediate[key].profitAmountRate += d[19]; // 一次利益率
                intermediate[key].advertisingFeeTotalRate += d[20]; // 広告費率
                intermediate[key].promotionFee += d[21]; // 販管費
                intermediate[key].averageUserUnitPrice += d[22]; // 平均顧客単価
                intermediate[key].averageUserProfitAmount += d[23]; // 平均顧客一次利益
                intermediate[key].averageGetQuantity += d[24]; // 平均購入個数
                intermediate[key].click += d[25]; // クリック数
                intermediate[key].conversion += d[26]; // 広告経由CV
                intermediate[key].amazonCvr += d[27]; // 広告経由CVR
                intermediate[key].cpc += d[28]; // CPC
                intermediate[key].ctr += d[29]; // CTR
                intermediate[key].roas += d[30]; // ROAS
                intermediate[key].sales += d[31]; // 広告経由売上
              }
              else
              {
                // まだない場合は初期化
                intermediate[key] = {
                  quantity: d[11],
                  salesAmount: d[13], // 売上
                  inventoryTotalPrice: d[14], // 原価
                  shippingFee: d[15], // 送料
                  commissionFee: d[16], // 手数料
                  advertisingFeeTotal: d[17], // 広告費
                  profitAmount: d[18], // 一次利益
                  profitAmountRate: d[19], // 一次利益率
                  advertisingFeeTotalRate: d[20], // 広告費率
                  promotionFee: d[21], // 販管費
                  averageUserUnitPrice: d[22], // 平均顧客単価
                  averageUserProfitAmount: d[23], // 平均顧客一次利益
                  averageGetQuantity: d[24], // 平均購入個数
                  click: d[25],
                  conversion: d[26],
                  amazonCvr: d[27],
                  cpc: d[28],
                  ctr: d[29],
                  roas: d[30],
                  sales: d[31],
                };
              }
            });

            // ブランド別販売実績のコンバータ作成
            const finalizedBrand = brandConverter.toSheetRow(intermediate[key]);

            
            let sheetName = "";
            let columnName = "";

            // カラム名リストを作成
            // ブランド別商品データの行を繰り返すAmazon
            for( let row = 0; row < skus.length; row++ )
            {
              let writeOrder = 0;
              // ブランド別商品データの列を繰り返す
              for( let col = 0; col < Object.keys( skus[row] ).length; col++ )
              {
                // カラム名リストからカラム名を取得
                columnName = columnArr[col];
                writeOrder = col
                // 結果データにブランド別商品データの商品名があるか判定
                // ブランド別商品データで使用するのは「種類」と書かれたカラムとなる
                if (skus[row][columnName] == resultProductObj[result][0][1]) {
                  // 出力時の順番を設定
                  // 出力するシート名を設定
                  // ループからに受ける
                  
                  sheetName = skus[row]['sheetname'];

                  //-------------------------
                  // 出力セル位置を設定
                  //-------------------------

                  // Item Name
                  const startColumnNum = 22 + ( 20 * writeOrder);
                  const startColumnAlphabet = parseColumnAlphabet( startColumnNum );
                  const itemName = `(${skus[row][columnName]})${dateDatas[0][7]}`;
                  const itemNameRange = `${startColumnAlphabet}:${startColumnAlphabet}`;
                  // 日付からシートに出力する範囲を取得
                  let writeRange = getWriteCellPoint(date, writeOrder);

                  rowDatas.push({
                    range: `${sheetName}!${writeRange}`,
                    values: [finalizedBrand],
                  })
                  if(totalRowDatas[sheetName]){
                    totalRowDatas[sheetName].push(finalizedBrand);
                  }else{
                    totalRowDatas[sheetName] = [finalizedBrand];
                  }
                
                  rowDatas.push({
                    range: `${sheetName}!${itemNameRange}`,
                    values: [[itemName]],
                  })
                  // writeOrder = writeOrder + 1;
                }
                
              }
            }
          });
        });
      });
    
      Object.entries(totalRowDatas).forEach(async ([sheetName, totalRowDatas]) => {
        let quantity = 0; // 販売数量
        let salesAmount = 0;// 売上
        let inventoryTotalPrice = 0; // 原価
        let shippingFee = 0; // 送料
        let commissionFee = 0; // 手数料
        let advertisingFeeTotal = 0; // 広告費
        let promotionFee = 0; // 販管費
        let profitAmount = 0; // 一次利益
        let profitAmountRate = 0; // 一次利益率
        let advertisingFeeTotalRate = 0; // 広告費率
        let averageUserUnitPrice = 0; // 平均顧客単価
        let averageUserProfitAmount = 0; // 平均顧客一次利益
        let averageGetQuantity = 0;  // 平均購入個数
        let click = 0;  // クリック数
        let conversion = 0; // 広告経由CV
        let amazonCvr = 0;  //広告経由CVR
        let cpc = 0;  // CPC
        let cpa = 0;  // CPA
        let roas = 0;  // ROAS
        let sales = 0; // 広告経由売上
        totalRowDatas.forEach((row: any) => {
            quantity += row[0];
            salesAmount += row[1];
            inventoryTotalPrice += row[2];
            shippingFee += row[3];
            commissionFee += row[4];
            advertisingFeeTotal += row[5];
            profitAmount += row[6];
            promotionFee += row[9];
            averageUserUnitPrice += row[10];
            averageUserProfitAmount += row[11];
            averageGetQuantity += row[12];
        })
        profitAmountRate = profitAmount / salesAmount;
        advertisingFeeTotalRate = advertisingFeeTotal / salesAmount;
        const totalRow = [
          quantity,
          salesAmount,
          inventoryTotalPrice,
          shippingFee,
          commissionFee,
          advertisingFeeTotal,
          profitAmount,
          profitAmountRate,
          advertisingFeeTotalRate,
          promotionFee,
          averageUserUnitPrice,
          averageUserProfitAmount,
          averageGetQuantity,
          click,
          conversion,
          amazonCvr,
          cpc,
          cpa,
          roas,
          sales,
        ];

        rowDatas.push({
          range: `${sheetName}!B${writeRow}:U${writeRow}`,
          values: [totalRow],
        })
     });
      await createValuesToBrandSheets(sheetId, rowDatas);
  }));

  // デバッグ用
  //await TestOutputSpreadSheet(cnt, sheetId);
}