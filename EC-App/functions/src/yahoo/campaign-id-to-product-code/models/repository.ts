import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IYahooCampaignIdToProductCode } from './schema';
import { YahooCampaignIdToProductCodeConverter } from './converter';

/**Firestoreのコレクション名 */
export const collectionPath = 'yahoo-campaign-id-to-product-code';

//-------------------------------------------------------------------------------
/**
 * Yahoo：キャンペーンIDのrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class YahooCampaignIdToProductCodeRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: YahooCampaignIdToProductCodeConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
    // 変数にFirestore情報を設定
    // コンバータの取得
    this.db = getFirestore();
    this.converter = new YahooCampaignIdToProductCodeConverter();
  }

  public async getAll(): Promise<IYahooCampaignIdToProductCode[]> 
  {
    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .orderBy('updatedAt', 'desc')
      .get();

    // 取得データを返却
    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *    重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { campaignId: string; }): Promise<IYahooCampaignIdToProductCode> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('campaignId', '==', query.campaignId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('YahooCampaignIdToProductCode: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ追加 or 更新
   * @param data データ
   * 
   * [ 概要 ]
   * - Firestoreからデータ取得する。
   * - 取得データが存在すれば、データ更新する。
   * - 取得データが存在しなければ、データ追加する。
   */
  //-------------------------------------------------------------------------------
  public async createOrUpdate( data: IYahooCampaignIdToProductCode ) : Promise<void>
  {
    // プライマリティキーとなる値があるか判定
    if( typeof data.campaignId === undefined || data.campaignId === '' )
    {
      // 存在しなければここで処理終了
      return;
    }

    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('campaignId', '==', data.campaignId)
      .limit(1)
      .get();

    // ドキュメントの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // ドキュメントの存在判定
    if( isExists )
    {
      // 存在する場合
      // Firestoreのデータ更新
      const doc = querySnapshot.docs[0];
      await doc.ref.update(data);
    }
    else
    {
      // 存在しない場合
      // Firestoreにデータ追加
      await this.db.collection(collectionPath).withConverter(this.converter).doc().create(data);
    }
  }

  //-------------------------------------------------------------------------------
  /**
   * バッチ作成
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IYahooCampaignIdToProductCode[]) 
  {
    // データの数だけFirestoreへデータ追加or更新
    // そして処理結果を変数に格納
    const results = await Promise.allSettled(data.map((d) => this.createOrUpdate(d)));

    // データ追加処理ので失敗があればログ出力する
    results.forEach((result) => {
      switch (result.status) 
      {
        case 'rejected':
          console.log(result.reason);
          break;
      }
    });
  }
}
