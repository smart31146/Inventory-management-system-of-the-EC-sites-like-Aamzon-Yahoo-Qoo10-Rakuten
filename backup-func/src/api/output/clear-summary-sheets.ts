import { runTime } from '../../helper';
import { topics } from '../topics';
import { PubSub } from '@google-cloud/pubsub';
import { ExecProgressStatus, ExecProgressType, IExecProgress } from '../../exec-progress/models/schema';
import { Timestamp } from 'firebase-admin/firestore';
import { ExecProgressRepository } from '../../exec-progress/models/repository';
import { outputClearSummarySheets } from '../../clear-summary-sheets/output';

type Params = {
  subscribeNotificationId?: string 
};

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 */
//--------------------------------------------------------------------------------------------
export const clearSummarySheets = runTime.pubsub
  .topic(topics.output.clearSummarySheets)
  .onPublish(async (message, ctx) => {
    
    // 通過ログ
    console.log(`on publish ${topics.output.clearSummarySheets}`);

    // 実行進捗リポジトリの生成
    const execProgressRepository = new ExecProgressRepository()

    // パラメータ取得
    const params = message.json?.params as Params | undefined;
      
    try 
    {
      await outputClearSummarySheets();

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
export const clearSummarySheetsOnCall = runTime.https.onCall(async (data) => {
  console.log(`on call ${topics.output.clearSummarySheets}`);

  const params = data?.params;
  const pubsub = new PubSub();
  const execProgressRepository = new ExecProgressRepository()

  await pubsub
  .topic(topics.output.clearSummarySheets)
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
