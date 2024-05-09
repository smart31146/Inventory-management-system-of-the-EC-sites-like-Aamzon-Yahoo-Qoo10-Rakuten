/**
 * 配列を任意のサイズのチャンクに分割する
 * @param array
 * @param size
 * @returns chunk
 */
export const chunk = <T extends any[]>(array: T, size: number): T[] =>
  array.reduce(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    []
  );
