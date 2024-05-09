//-------------------------------------------------------------------------------
/**
 * ブランド別販売実績で出力するセル位置を返却
 * @param date 日付（シートには日付が行ごとに書かれておりそれと合わせる）
 * @param writeOrder 書き込み順番（商品は横に長く複数を書き込むのでその順番）
 * @returns セルの出力範囲
 */
//-------------------------------------------------------------------------------
export function getWriteCellPoint( date: any, writeOrder: any ) : string
{
  //-------------------------
  // 初期設定
  //-------------------------

  // 日付をstring型からDate型に変換
  const dtDate = new Date(date);

  // アルファベットの数
  const columItemCount = 20;

  // 書き込む基準位置の設定
  const startRowPoint = 3;     // 3行目
  const startColumnAxis = 22;  // 1：A列、14：N列

  //-------------------------
  // レコードの設定
  //-------------------------

  // ベースとなる日付のDateを作成
  // シートに記入されている日付を固定値で設定
  const baseDate = new Date('2024/01/01');
  
  // ベース日付との差分を出す
  // 86,400,000ミリ秒 = 24時間*60分*60秒*1000ミリ秒
  const diffTime = dtDate.getTime() - baseDate.getTime();
  const onDayMilliSecond = 24 * 60 * 60 * 1000;
  const diffDayCOunt = Math.floor( diffTime / onDayMilliSecond );

  // スプレッドシートへ書き込む行の場所を設定
  // A列に書かれた日付に合わせて出力したいから日付分を加算する
  const writeRow = startRowPoint + diffDayCOunt;

  //-------------------------
  // カラムの設定
  //-------------------------

  // 開始カラムのアルファベット作成
  // 基本軸からカラム数に順番をかけて位置を調整
  const startColumnNum = startColumnAxis + ( columItemCount * writeOrder );
  const startColumnAlphabet = parseColumnAlphabet( startColumnNum );

  // 終了カラムのアルファベット作成
  // 開始位置を軸にカラム数を加えて終了位置とする
  // 開始位置も列個数に含まれているから-1する
  const endColumnNum = ( startColumnNum + columItemCount ) - 1;
  const endColumnAlphabet = parseColumnAlphabet( endColumnNum );

  //-------------------------
  // 範囲の設定
  //-------------------------

  // セル範囲を設定
  const sp = startColumnAlphabet + writeRow;
  const ep = endColumnAlphabet
  const range = sp + ":" + ep;

  // シートへの影響範囲を作成して返却
  return range;
}

//-------------------------------------------------------------------------------
/**
 * 数値からアルファベットのカラムに変換
 * @param num 数値
 * @returns 
 */
//-------------------------------------------------------------------------------
export function parseColumnAlphabet( num : number ) : string
{
  // アルファベットの数
  const alphabetCount = 26;
  
  // Aの位置にあるUTF-16文字コードを取得
  const alphabetA = 'A'.charCodeAt(0);

  // 変数
  let count = num;
  let alphabet = "";

  // カウントを繰り返す
  while( count >= 1 )
  {
    // カウントを原産
    count--;

    // アルファベットの設定
    alphabet = String.fromCharCode( alphabetA + ( count % alphabetCount ) ) + alphabet;

    // 
    count = Math.floor( count / alphabetCount );
  }

  // アルファベットを返却
  return alphabet;
}