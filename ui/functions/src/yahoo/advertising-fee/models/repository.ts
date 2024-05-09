import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { IYahooAdvertisingFee } from './schema';
import { YahooAdvertisingFeeConverter } from './converter';
import { chunk } from '../../../helper/chunk';

/**Firestoreのコレクション名 */
export const collectionPath = 'yahoo-advertising-fee';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告宣伝費のrepositoryクラス
 */
//-------------------------------------------------------------------------------
export class YahooAdvertisingFeeRepository 
{
  /**Firestore情報 */
  private readonly db: Firestore;

  /**コンバータ */
  private readonly converter: YahooAdvertisingFeeConverter;

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   */
  //-------------------------------------------------------------------------------
  constructor() 
  {
    // 変数にFirestore情報を設定
    // Converter取得
    this.db = getFirestore();
    this.converter = new YahooAdvertisingFeeConverter();
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreから全データ取得
   * @param query 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  public async getAll(query: { date: number; productCode: string; }): Promise<IYahooAdvertisingFee[]> 
  {
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
  public async getOne(query: { date: number; productCode: string; }): Promise<IYahooAdvertisingFee> 
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
      throw new Error('YahooAd: Document not found');
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
  public async create(data: IYahooAdvertisingFee): Promise<void> 
  {
    try {
      // Firestoreのコレクションを取得
      await this.getOne(data);
      throw new Error('RakutenAd: Document already exists');
    } catch (error) {
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
  public async update(data: Partial<IYahooAdvertisingFee>): Promise<void> 
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
      throw new Error('YahooAd: Document not found');
    }
  }

  //-------------------------------------------------------------------------------
  /**
   * バッチ作成
   * - firestoreのバッチは一度に500件までのため、チャンクに分割して処理する
   * - レコード挿入時の重複チェックは行わない
   *   - データ参照時に重複がある場合、更新日が最新のものを正とみなす実装を行う
   *   - 影響範囲：getOne, update
   * 
   * @param data 
   */
  //-------------------------------------------------------------------------------
  public async batchCreate(data: IYahooAdvertisingFee[]) 
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

      // チャックの数だけ繰り返してバッチに設置
      chunkedData.forEach((d) => {
        const doc = ref.doc();
        batch.set(doc, d);
      });

      // バッチのコミット
      await batch.commit();
    }
  }
}
