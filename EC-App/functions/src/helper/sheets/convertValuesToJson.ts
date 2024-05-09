//-------------------------------------------------------------------------------
/**
 * JSONデータへの変換処理
 * @param values 変換前のデータ
 * @returns JSON変換後のデータ
 */
//-------------------------------------------------------------------------------
export const convertValuesToJson = (values: any[][]) => {

  // ヘッダーとデータを定義
  const [header, ...data] = values;
  
  // JSONデータに構築して返却する
  return data.map((row) => {

    // 結果を格納する変数の定義
    const obj: any = {};

    // 行の数だけ繰り返しJSONの「key、value」の構成を作る
    row.forEach((cell, i) => {
      obj[header[i]] = cell;
    });

    // 作成した結果を返却
    return obj;
  });
};
