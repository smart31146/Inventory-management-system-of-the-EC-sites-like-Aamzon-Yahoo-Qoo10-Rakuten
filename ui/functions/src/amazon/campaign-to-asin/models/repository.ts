import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IAmazonCampaignToAsin } from './schema';
import { AmazonCampaignToAsinConverter } from './converter';

/**Firestoreのコレクション名 */
export const collectionPath = 'amazon-campaign-to-asin';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費のrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class AmazonCampaignToAsinRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: AmazonCampaignToAsinConverter;

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
    this.converter = new AmazonCampaignToAsinConverter();
  }

  public async getAll(): Promise<IAmazonCampaignToAsin[]> 
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
  public async getOne(query: { startAt: number; endAt: number; campaign: string; }): Promise<IAmazonCampaignToAsin> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('startAt', '==', query.startAt)
      .where('endAt', '==', query.endAt)
      .where('campaign', '==', query.campaign)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('AmazonCampaign-to-asin: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreにデータ追加
   * @param data データ
   */
  //-------------------------------------------------------------------------------
  public async create(data: IAmazonCampaignToAsin): Promise<void> 
  {
    try 
    {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('AmazonCampaign-to-asin: Document already exists');
    } 
    catch (error) 
    {
      // エラーが投げられた時を正とする
    }

    // Firestoreにデータを追加
    await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .doc()
      .create(data);
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ更新
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *    重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async update(data: Partial<IAmazonCampaignToAsin>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('startAt', '==', data.startAt)
      .where('endAt', '==', data.endAt)
      .where('campaign', '==', data.campaign)
      .orderBy('updatedAt', 'desc')
      .get();

    // ドキュメントの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // ドキュメントの存在判定
    if( isExists )
    {
      // データが存在する場合
      // Firestoreのデータ更新
      const doc = querySnapshot.docs[0];
      await doc.ref.withConverter(this.converter).update(data);
    }
    else
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('AmazonCampaign-to-asin: Document not found');
    }
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
  public async createOrUpdate( data: IAmazonCampaignToAsin ) : Promise<void>
  {
    // プライマリティキーとなる値があるか判定
    if(  ( typeof data.startAt === undefined || data.startAt === 0 )
      || ( typeof data.endAt === undefined || data.endAt === 0 )
      || ( typeof data.campaign === undefined || data.campaign === "" ))
    {
      // 存在しなければここで処理終了
      return;
    }

    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('startAt', '==', data.startAt)
      .where('endAt', '==', data.endAt)
      .where('campaign', '==', data.campaign)
      .orderBy('updatedAt', 'desc')
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
  public async batchCreate(data: IAmazonCampaignToAsin[]) 
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
