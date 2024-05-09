
//-------------------------------------------------------------------------------
/**
 * 文字列の浮動小数地をNumber型に変換
 * @param strValue string型の浮動小数値
 * @returns 浮動小数値
 */
//-------------------------------------------------------------------------------
export const StringToFloat = ( strValue: string ) => {

    // 変換イメージ
    //  - 1,234.5 -> 1234.5

    // string型からNumber型へ変換
    //  1. 文字列にコンマ(,)が含まれていれば取り除く
    //  2. 小数点以降の値も残るように文字列を数値に変換する
    return Number.parseFloat( strValue.replace(',', '') );
}

//-------------------------------------------------------------------------------
/**
 * ※この関数について
 * この関数は使用しない。
 * 変換イメージに書いた内容となっていたのはCSVファイル作成の段階で対応ミスだった。
 * 今後この形式にはならないのでこの関数は使用しない。
 * 
 * 蔵奉行_在庫単価の「在庫単価」を整数値に変換（変は形式になっているので特別に調整）
 * @param strValue 
 * @returns 
 */
//-------------------------------------------------------------------------------
export const StringToFloat_InventoryUnitPrice = ( strValue: string ) => {

    // 変換イメージ
    //  - 1.234,5 -> 1234.5

    // ピリオド（.）を抜く
    const rectPeriod = strValue.replace('.', '')

    // カンマ（,）をピリオド（.）にする
    const commaToPeriod = rectPeriod.replace(',', '.')

    // 文字列から数値に変換して返却
    return Number.parseFloat( commaToPeriod );
}

//-------------------------------------------------------------------------------
/**
 * パーセントを少数に変換
 * 引数が不正な場合は0を返す
 * @param percentStr string型のパーセント値
 * @returns 浮動小数値
 */
//-------------------------------------------------------------------------------
export const PercentToDecimal = ( percentStr: string): number => {
    const percentNum = Number(percentStr.replace('%', ''));
    if (isNaN(percentNum)) return 0;
    return percentNum / 100;
}

//-------------------------------------------------------------------------------
/**
 * 金額の¥を取り除いて数値に変換
 * @param priceStr string型の金額
 * @returns 数値
 */
//-------------------------------------------------------------------------------
export const ParsePrice = ( priceStr: string ): number => {
    const parsed = Number(priceStr.replace('¥', '').replace(",",""));
    if (isNaN(parsed)) return 0;
    return parsed;
}
