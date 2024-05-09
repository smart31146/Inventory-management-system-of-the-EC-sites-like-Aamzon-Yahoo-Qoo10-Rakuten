import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IQoo10AdOthers } from './schema';
import { Qoo10AdOthersConverter } from './converter';

/**Firestoreのコレクション名 */
export const collectionPath = 'qoo10-ad-others';

//-------------------------------------------------------------------------------
/**
 * Qoo10：広告宣伝費_手入力分のrepository
 */
//-------------------------------------------------------------------------------
export class Qoo10AdOthersRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: Qoo10AdOthersConverter;

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
    this.converter = new Qoo10AdOthersConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(query?: { date: number; productCode: string; }): Promise<IQoo10AdOthers[]> 
  {
    if (!query) {
      // Firestoreのコレクションを取得
      const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .orderBy('updatedAt', 'desc')
      .get();

      // 取得データを返却
      return snapshot.docs.map((doc) => doc.data());
    }

    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.date)
      .where('productCode', '==', query.productCode)
      .get();

    // 取得したコレクションからデータを取得して返却
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
  public async getOne(query: { date: number; productCode: string; }): Promise<IQoo10AdOthers> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.date)
      .where('productCode', '==', query.productCode)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('RakutenAd: Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから指定した注文日のデータを取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getByOrderedAt(query: {orderedAt: number}): Promise<IQoo10AdOthers[]>
  {
    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('orderedAt', '==', query.orderedAt)
      .get();

    // 取得したコレクションからデータを取得して返却
    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreにデータ追加
   * @param data データ
   */
  //-------------------------------------------------------------------------------
  public async create(data: IQoo10AdOthers): Promise<void> 
  {
    try 
    {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('Qoo10Ad: Document already exists');
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
   * Firestoreのデータ更新Firestoreのデータ更新
   *  - レコードの一括挿入（batchCreate）時に重複を許容しているため、
   *    重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async update(data: Partial<IQoo10AdOthers>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('date', '==', data.date)
      .where('productCode', '==', data.productCode)
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
      throw new Error('Qoo10Ad-others: Document not found');
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
  public async createOrUpdate( data: IQoo10AdOthers ) : Promise<void>
  {
    // プライマリティキーとなる値が存在するか判定
    if(  ( typeof data.date === undefined || data.date === 0 )
      || ( typeof data.productCode === undefined || data.productCode === '' ))
    {
      // 存在しなければここで処理終了
      return;
    }

    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', data.date)
      .where('productCode', '==', data.productCode)
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
  public async batchCreate(data: IQoo10AdOthers[]) 
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
