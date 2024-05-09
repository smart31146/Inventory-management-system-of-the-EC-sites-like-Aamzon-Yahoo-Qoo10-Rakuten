//-------------------------------------------------------------------------------
/**
 * @param url
 * @returns sheetId
 */
//-------------------------------------------------------------------------------
export const getSheetIdFromUrl = (url: string): string => {
  const prefixRemoved = url.replace(
    'https://docs.google.com/spreadsheets/d/',
    ''
  );

  const indexOfEdit = prefixRemoved.indexOf('/edit');
  const idRemoved = prefixRemoved.slice(0, indexOfEdit);

  return idRemoved;
};
