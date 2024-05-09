import { IQoo10AdvertisingFee } from './schema';
import { Qoo10AdvertisingFeeConverter } from './converter';
import { IQoo10AdSmartSales } from '../../ad-smart-sales/models/schema';
import { IQoo10AdOthers } from '../../ad-others/models/schema';

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告のrelationsクラス
 */
//-------------------------------------------------------------------------------
export class Relations 
{
  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
  }

  //-------------------------------------------------------------------------------
  /**
   * 初期化処理
   * @returns 
   */
  //-------------------------------------------------------------------------------
  static init(): Relations 
  {
    return new Relations();
  }

  //-------------------------------------------------------------------------------
  /**
   * 全ての広告を日付ごとに取得
   *  1. 広告から指定した注文日のデータを取得
   *  2. returnで取得した広告を返却
   * @param orderedAt 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public getAllAdsByDate( orderedAt: number, adSource: {
    adSmart: IQoo10AdSmartSales[];
    adOthers: IQoo10AdOthers[];
  }): IQoo10AdvertisingFee[]
  {
    // コンバーター作成
    const converter = new Qoo10AdvertisingFeeConverter();

    // Qoo10広告のコンバーターにスマートセールス広告のデータを設定
    //  - 設定するデータは注文日で指定した日付のものとなる
    const adSmart = adSource.adSmart.filter((i) => i.date === orderedAt).map((smart) =>
      converter.fromAdSmart(smart)
    );

    // Firestoreから指定した注文日のデータを取得
    //  - 取得データ：Qoo10広告宣伝費手_入力分
    const adOthers = adSource.adOthers.filter((i) => i.date === orderedAt);

    // 取得した情報を返却
    return [...adSmart, ...adOthers];
  }
}
