import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IRakutenAdvertisingFee } from './schema';
import { RakutenAdvertisingFeeConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'rakuten-advertising-fee';

//-------------------------------------------------------------------------------
/**
 * 楽天：広告宣伝費のrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class RakutenAdvertisingFeeRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: RakutenAdvertisingFeeConverter;

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
    this.converter = new RakutenAdvertisingFeeConverter();
  }

  /**
   * 日付+広告費種別+商品管理番号をドキュメントのIDとする
   * @param data
   * @returns
   */
  private _docId(
    data: Pick<IRakutenAdvertisingFee, 'date' | "productControlCode" | "type">
  ): string {
    return `${data.date || ""}_${data.type || ""}_${data.productControlCode} || "`;
  }
  
  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   */
  //-------------------------------------------------------------------------------
  public async getAll(query: { date: number; productControlCode: string; }): Promise<IRakutenAdvertisingFee[]> 
  {
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

  //-------------------------------------------------------------------------------
  /**
   * FirestoreからID指定したデータ取得
   *  - 重複レコードがある場合は更新日が直近のものを正とする
   * 
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getOne(query: { date: number; productControlCode: string; type: string; }): Promise<IRakutenAdvertisingFee> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .withConverter(this.converter)
      .where('date', '==', query.date)
      .where('productControlCode', '==', query.productControlCode)
      .where('type', '==', query.type)
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
      throw new Error('RakutenAd: Document not found');
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
  public async create(data: IRakutenAdvertisingFee): Promise<void> 
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
   *  - 重複レコードがある場合は更新日が直近のものを正とする
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async update(data: Partial<IRakutenAdvertisingFee>): Promise<void> 
  {
    // Firestoreのコレクションを取得
    const querySnapshot = await this.db
      .collection(collectionPath)
      .where('date', '==', data.date)
      .where('productControlCode', '==', data.productControlCode)
      .where('type', '==', data.type)
      .orderBy('updatedAt', 'desc')
      .limit(1)
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
   * バッチ作成
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - 日付+広告費種別+商品管理番号をドキュメントのIDとすることで一意性を保つ
   * @param data
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IRakutenAdvertisingFee[]) 
  {
    // 一度の実行できる最大件数
    // Firestoreのバッチは一度に500件までのため
    const limit = 500;

    // Firestoreバッチの一度に実行できるように配列をチャンク分割して繰り返す
    for (const chunkedData of chunk(data, limit)) 
    {
      // Firestoreバッチの取得
      const batch = this.db.batch();

      // ドキュメント設定
      const ref = this.db
        .collection(collectionPath)
        .withConverter(this.converter);

      // チャンクの数だけ繰り返してバッチに設置
      chunkedData.forEach((d) => {
        if (this._docId(d).startsWith('_') || this._docId(d).indexOf("__") !== -1 || this._docId(d).endsWith('_')) {
          return;
        }

        const doc = ref.doc(this._docId(d));
        batch.set(doc, d, { merge: true });
      });

      // バッチのコミット
      await batch.commit();
    }
  }
}
