import { distributeLineItems } from './distributeLineItems';
import { getDailyFinalizedShipping } from './getDailyFinalizedShipping';
import { insertDailyFinalizedShipping } from './insertDailyFinalizedShipping';

/**
 * 出荷確定データに関連するタスクを実行する
 * - CSVファイルの読み込み
 * - 出荷確定データの演算（按分）
 * - Firestoreへのデータ保存
 * @param {Date} finalizedAt 出荷確定日
 * @param {string} csvId CSV ID
 * @returns {Promise<void>}
 */
export const finalizedShippingBatch = async (
  finalizedAt: Date,
  csvId: 'c009' | 'c005' | 'c011' | 'c015'
): Promise<void> => {
  /**
   * 引数に取る日付の出荷確定データを取得する
   */
  const shipping = await getDailyFinalizedShipping(finalizedAt, csvId);

  /**
   * 出荷確定データの演算（按分）
   * クラウドロジ固有の処理のためコメントアウト
   */
  //const distributed = distributeLineItems(shipping);

  /**
   * 演算後の出荷確定データをFirestoreへ保存する
   */
  console.log(shipping.length)
  await insertDailyFinalizedShipping(shipping);
};
