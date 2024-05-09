import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IRakutenAdOthers, RakutenAdType } from './schema';
import { RakutenAdOthersConverter } from './converter';

/**Firestoreのコレクション名 */
export const collectionPath = 'rakuten-ad-others';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告費手入力分のrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class RakutenAdOthersRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: RakutenAdOthersConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor(db?: Firestore) 
  {
    // 変数にFirestore情報を設定
    // コンバータの取得
    this.db = db ?? getFirestore();
    this.converter = new RakutenAdOthersConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   */
  //-------------------------------------------------------------------------------
  public async getAll(query?: { date: number; productControlCode: string; }): Promise<IRakutenAdOthers[]> 
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
      .where('productControlCode', '==', query.productControlCode)
      .get();

    // 取得したコレクションからデータを取得して返却
    return snapshot.docs.map((doc) => doc.data());
  }


  public async getByOrderedAt(query: {orderedAt: number}): Promise<IRakutenAdOthers[]>
  {
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.orderedAt)
      .get();

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
  public async getOne(query: { date: number; productControlCode: string; type: RakutenAdType}): Promise<IRakutenAdOthers | undefined> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.date)
      .where('productControlCode', '==', query.productControlCode)
      .where('type', '==', query.type)
      .orderBy('updatedAt', 'desc')
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
     return undefined;
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
  public async create(data: IRakutenAdOthers): Promise<void> 
  {
    try 
    {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('RakutenAd: Document already exists');
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
  public async update(data: Partial<IRakutenAdOthers>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('date', '==', data.date)
      .where('productControlCode', '==', data.productControlCode)
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
      throw new Error('RakutenAd: Document not found');
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
  public async createOrUpdate( data: IRakutenAdOthers ) : Promise<void>
  {
      // プライマリティキーとなる値が存在するか判定
      if(  ( typeof data.date === undefined || data.date === 0 )
        || ( typeof data.productControlCode === undefined || data.productControlCode === "" ))
      {
          // 存在しなければここで処理終了
          return;
      }

      // Firestoreのコレクションを取得
      const querySnapshot = await this.db
        .collection(collectionPath)
        .withConverter(this.converter)
        .where('date', '==', data.date)
        .where('productControlCode', '==', data.productControlCode)
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
  public async batchCreate(data: IRakutenAdOthers[]) 
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
