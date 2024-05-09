import { runTime } from '../../helper';
import { outputFinalizedSalesToSheet } from '../../finalized-sales-by-product/output';
import { calcFinalizedSalesByOrder } from '../../finalized-sales-by-order/calc';
import { calcFinalizedSalesByProduct } from '../../finalized-sales-by-product/calc';
import { topics } from '../topics';
import { PubSub } from '@google-cloud/pubsub';
import { ExecProgressStatus, ExecProgressType, IExecProgress } from '../../exec-progress/models/schema';
import { Timestamp } from 'firebase-admin/firestore';
import { ExecProgressRepository } from '../../exec-progress/models/repository';
import { outputFinalizedSalesBrandOfProductToSheet }from '../../finalized-sales-by-brand/output';
import { TestOutputSpreadSheet } from '../batch/test_outputSpreadSheet';

type Params = {
  /**
   * 集計日
   * CSVファイル名の検索に利用する
   * @required
   * @format YYYY-MM-DD
   */
  finalizedAt: string;
  /**
   * 販売チャネル
   * 特定の販売チャネルのみを対象にする場合に指定する
   * @optional
   */
  salesChannel?: 'rakuten' | 'amazon' | 'yahoo' | 'qoo10';

  isNotification? : boolean

  subscribeNotificationId?: string 

};

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const finalizedSales = runTime.pubsub
  .topic(topics.output.finalizedSales)
  .onPublish(async (message, ctx) => {
    
    // 通過ログ
    console.log(`on publish ${topics.output.finalizedSales}`);

    // 実行進捗リポジトリの生成
    const execProgressRepository = new ExecProgressRepository()

    // パラメータ取得
    const params = message.json?.params as Params | undefined;

    // 出荷確定日の取得
    //  - パラメータに出荷確定日が存在すれば、取得する
    //  - そうでなければ、当日の日付を取得
    const finalizedAt =
      params?.finalizedAt &&
      typeof params.finalizedAt !== 'undefined' &&
      params.finalizedAt !== ''
        ? new Date(params.finalizedAt)
        : new Date();

    // 販売チャンネルの取得
    //  - パラメータに販売チャンネルが存在すれば、取得する
    //  - そうでなければ「inhouse」を設定
    const salesChannel = params?.salesChannel || 'inhouse';
      
    try 
    {
      // 出荷確定日を0時にフォーマット
      // 出荷確定日を日本時間で設定
      finalizedAt.setHours(0, 0, 0, 0);
      let date = new Date(finalizedAt.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))

      console.log(`Start Calculation with Date Count: `, `${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`);

      // 販売実績データの演算
      const result1 = await calcFinalizedSalesByOrder({
        finalizedAt : date,
        salesChannel,
      });

      // 販売実績データの集計処理
      const result2 = await calcFinalizedSalesByProduct(result1);


      // 販売実績データが無い判定
      if(result2.length == 0) 
      {
        // データが無い場合
        // 実行進捗リポジトリに「No data」を登録
        return await execProgressRepository.updateStatus(params?.subscribeNotificationId! , ExecProgressStatus.ERROR, 'No data ' + `${finalizedAt.getFullYear()}/${finalizedAt.getMonth() +1}/${finalizedAt.getDate()}`)
      }

      console.log('Finish Calculation Starting to Output to Sheet');

      // スプレッドシートに商品別販売実績を出力
      await outputFinalizedSalesToSheet({
        fs: result2,
        finalizedAt: date,
      });

      // ブランド別販売実績の演算＆スプレッドシート出力
      await outputFinalizedSalesBrandOfProductToSheet({
        fs: result2,
        finalizedAt: date,
      });

      console.log('Finish Output to Sheet');

      // 実行進捗リポジトリに「DONE」を登録
      return await execProgressRepository.updateStatus(params?.subscribeNotificationId! , ExecProgressStatus.DONE)
    } 
    catch (error: any) 
    {
      // ログにエラー内容を出力
      console.log(error)

      // 実行進捗リポジトリに「ERROR」を登録
      return await execProgressRepository.updateStatus(params?.subscribeNotificationId! , ExecProgressStatus.ERROR, error.message as string || '')
    }
  });

//--------------------------------------------------------------------------------------------
/**
 * onCall処理
 */
//--------------------------------------------------------------------------------------------
export const finalizedSalesOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.output.finalizedSales}`);

  const params = data?.params;
  const pubsub = new PubSub();
  const execProgressRepository = new ExecProgressRepository()

  await pubsub
  .topic(topics.output.finalizedSales)
  .publishMessage({ json: { params: { ...params, subscribeNotificationId: params.id } } })
  
  const execProgressData : IExecProgress ={ 
    execId: params.id,
    createdAt: Timestamp.now().toMillis(),
    status: ExecProgressStatus.PROGRESSING,
    type: ExecProgressType.TRANSACTION_EXEC,
    updatedAt: Timestamp.now().toMillis(),
   }
   return await execProgressRepository.create(execProgressData)
});


// export const testSheetId = runTime.https.onCall(async (data) => {
//   console.log('SHEET_ID', process.env.SHEET_ID);
//   return process.env.SHEET_ID
// })
