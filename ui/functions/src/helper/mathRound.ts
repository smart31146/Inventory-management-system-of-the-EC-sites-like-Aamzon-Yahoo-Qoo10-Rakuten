/**
 * 数値を指定した桁数で四捨五入する。初期値は小数点以下1桁
 * @param value
 * @param decimalPlace 小数点以下の桁数 ex. 1 => 0.1, 2 => 0.01
 */
export const mathRound = (value: number, decimalPlace: number = 1) => {
  return (
    Math.round(value * Math.pow(10, decimalPlace)) / Math.pow(10, decimalPlace)
  );
};
