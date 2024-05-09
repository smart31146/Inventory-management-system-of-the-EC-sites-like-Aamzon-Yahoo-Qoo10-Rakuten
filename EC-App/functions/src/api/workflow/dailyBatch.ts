import { PubSub } from '@google-cloud/pubsub';
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic';
import { runTime } from '../../helper';
import { topics } from '../topics';

//--------------------------------------------------------------------------------------------
/**
 * デイリーTOPICリスト
 */
//--------------------------------------------------------------------------------------------
const dailyBatchTopics: {
  label: string;
  name: string;
  message: MessageOptions;
}[] = [
  {
    label: '商品マスタ同期',
    name: topics.batch.productsMaster,
    message: { json: {} },
  },
  {
    label: 'ブランド変換マスタ同期',
    name: topics.batch.divisionCodeMaster,
    message: {json: {}},
  },
  {
    label: '販売元マスタ同期',
    name: topics.batch.salesChannelMaster,
    message: {json: {}},
  },
  {
    label: '出荷確定データ取得-Amazon',
    name: topics.batch.finalizedShippingAmazon,
    message: {json: {
     
    }},
  },
  {
    label: '出荷確定データ取得-楽天',
    name: topics.batch.finalizedShippingRakuten,
    message: {json: {
     
    }},
  },
  {
    label: '出荷確定データ取得-Yahoo',
    name: topics.batch.finalizedShippingYahoo,
    message: {json: {
     
    }},
  },
  {
    label: '出荷確定データ取得-Qoo10',
    name: topics.batch.finalizedShippingQoo10,
    message: {json: {
     
    }},
  },
  {
    label: '注文データ取得',
    name: topics.batch.orders,
    message: {json: {}},
  },
  {
    label: '広告費データ取得',
    name: topics.batch.advertisingFee,
    message: {json: {}},
  },
  {
    label: '請求明細データ取得',
    name: topics.batch.claims,
    message: {json: {}},
  },
];
type Params = {
  finalizedAt: string
}

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理
 *  - 呼び出しトリガー：topics.workflow.dailyBatch
 */
//--------------------------------------------------------------------------------------------
export const dailyBatch = runTime.pubsub
  .topic(topics.workflow.dailyBatch)
  .onPublish(async (message) => {

    // 通過ログ
    console.log(`on publish ${topics.workflow.dailyBatch}`);

    // パラメータ取得
    // pubsub取得
    const params = message.json?.params as Params | undefined;
    const pubsub = new PubSub();

    // 出荷確定日を取得
    //  - パラメータの出荷確定日が存在すれば、パラメータから取得
    //  - そうでなければ、空文字を設定
    const finalizedAt =
    params?.finalizedAt &&
    typeof params.finalizedAt !== 'undefined' &&
    params.finalizedAt !== ''
      ? new Date(params.finalizedAt)
      : ''

    // デイリーTOPICリストの数だけ繰り返す
    dailyBatchTopics.forEach((topic) => {

      // TOPICからメッセージを取得
      const messageTopic  = topic.message

      // 出荷確定日が存在しており、トピックの名前が「出荷確定データ取得-Amazon」か判定
      //  - 存在していれば、メッセージTOPICのJSONの「params」に出荷確定日を設定
      if(finalizedAt  && topic.name ===  topics.batch.finalizedShippingAmazon)  {
        messageTopic['json']['params'] = {
          finalizedAt : finalizedAt
        }
      }
      // 出荷確定日が存在しており、トピックの名前が「出荷確定データ取得-楽天」か判定
      //  - 存在していれば、メッセージTOPICのJSONの「params」に出荷確定日を設定
      else if(finalizedAt  && topic.name ===  topics.batch.finalizedShippingRakuten)  {
        messageTopic['json']['params'] = {
          finalizedAt : finalizedAt
        }
      }
      // 出荷確定日が存在しており、トピックの名前が「出荷確定データ取得-Yahoo」か判定
      //  - 存在していれば、メッセージTOPICのJSONの「params」に出荷確定日を設定
      else if(finalizedAt  && topic.name ===  topics.batch.finalizedShippingYahoo)  {
        messageTopic['json']['params'] = {
          finalizedAt : finalizedAt
        }
      }
      // 出荷確定日が存在しており、トピックの名前が「出荷確定データ取得-Qoo10」か判定
      //  - 存在していれば、メッセージTOPICのJSONの「params」に出荷確定日を設定
      else if(finalizedAt  && topic.name ===  topics.batch.finalizedShippingQoo10)  {
        messageTopic['json']['params'] = {
          finalizedAt : finalizedAt
        }
      }

      // pubsubにメッセージTOPICを設定
      pubsub.topic(topic.name).publishMessage(messageTopic);
    });
  });

//--------------------------------------------------------------------------------------------
/**
 * OnCall処理
 */
//--------------------------------------------------------------------------------------------
export const dailyBatchOnCall = runTime.https.onCall(async (data) => {

  // 通過ログ
  console.log(`on call ${topics.workflow.dailyBatch}`);

  // パラメータ取得
  // パラメータから出荷確定日を取得
  const params = data?.params;
  const finalizedAt = params?.finalizedAt ;

  // pubsub取得
  const pubsub = new PubSub();
  
  // 出荷確定日を設定してpubsub処理を呼び出し
  //  - 対象：topics.workflow.dailyBatch
  await pubsub.topic(topics.workflow.dailyBatch).publishMessage({ json: {
    params: {
      finalizedAt
    } 
  } });
});

//--------------------------------------------------------------------------------------------
/**
 * pubsub処理（※スケジュール実行）
 *  - 日本時間
 *  - 午前6時
 */
//--------------------------------------------------------------------------------------------
export const dailyBatchSchedule = runTime.pubsub
  .schedule('0 6 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {

    // 通過ログ
    console.log(`on run scheduled ${topics.workflow.dailyBatch}`);

    // pubsub取得
    // 何も設定せずにpubsub処理を呼び出し
    //  - 対象：topics.workflow.dailyBatch
    const pubsub = new PubSub();
    await pubsub.topic(topics.workflow.dailyBatch).publishMessage({ json: {} });
  });
