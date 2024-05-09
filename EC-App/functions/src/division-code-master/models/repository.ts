import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IDivisionCodeMaster } from './schema';
import { DivisionCodeMasterConverter } from './converter';

/**Firestoreのコレクション名：ブランド変換マスタ */
export const collectionPath = 'division-code-master';

//-------------------------------------------------------------------------------
/**
 * ブランド変換マスタのrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class DivisionCodeMasterRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**ブランド変換マスタのコンバータ */
  private readonly converter: DivisionCodeMasterConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
    // 変数にFirestore情報を設定
    this.db = getFirestore();

    // コンバータの取得
    this.converter = new DivisionCodeMasterConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(): Promise<IDivisionCodeMaster[]> 
  {
    // Firestoreのコレクションを取得
    const snapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .get();

    // 取得したコレクションからデータを取得して返却
    return snapshot.docs.map((doc) => doc.data());
  }

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { brandName: string; }): Promise<IDivisionCodeMaster> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('brandName', '==', query.brandName)
      .get();

    // データの存在結果を取得
    const isExists = querySnapshot.size > 0;

    // 取得データの存在判定
    if (!isExists) 
    {
      // データが存在しない場合
      // エラーとして処理する
      throw new Error('Document not found');
    }

    // 取得データを返却
    return querySnapshot.docs[0].data();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreにデータ追加
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async create(data: IDivisionCodeMaster): Promise<void> 
  {
    try 
    {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('Document already exists');
    } 
    catch (error) 
    {
      // getOneからエラーが投げられた時を正とする
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
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async update(data: Partial<IDivisionCodeMaster>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('brandName', '==', data.brandName)
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
      // エラーとして処理する
      throw new Error('Document not found');
    }
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ追加or更新
   * @param data データ
   * 
   * [ 概要 ]
   * - Firestoreからデータ取得する。
   * - 取得データが存在すれば、データ更新する。
   * - 取得データが存在しなければ、データ追加する。
   */
  //-------------------------------------------------------------------------------
  public async createOrUpdate( data: IDivisionCodeMaster ) : Promise<void>
  {
    // プライマリティキーとなる値が存在するか判定
    if( typeof data.brandName === undefined || data.brandName === "" )
    {
      // 存在しなければここで処理終了
      return;
    }

    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('brandName', '==', data.brandName)
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
  public async batchCreate(data: IDivisionCodeMaster[]) 
  {
    // 商品マスタのデータの数だけFirestoreへデータ追加or更新
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
