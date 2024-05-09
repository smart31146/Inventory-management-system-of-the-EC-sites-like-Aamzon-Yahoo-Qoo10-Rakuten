import { getStorage } from 'firebase-admin/storage';
import { parse, Options } from 'csv-parse/sync';
import { CsvConstants } from './constants';
import { format } from 'date-fns';
import { decode } from 'iconv-lite';
import { detect } from 'jschardet';

export type CsvId = keyof typeof CsvConstants;

/**
 * CSVをストレージから取得する
 * @param csvId
 * @param date
 * @param option csv-parse options
 */
export const getCsvFromStorage = async (
  csvId: CsvId,
  date: Date,
  options?: Omit<Options, 'encoding'>
) => {
  const storage = getStorage();
  const bucket = storage.bucket();
 
  const dateString = format(date, CsvConstants[csvId].fileNameFormat);
  const fileName = `${CsvConstants[csvId].path}/${dateString}.csv`;
  const file = bucket.file(fileName);

  if (!(await file.exists())[0]) {
    console.log(`fileName: ${fileName} not found`);
    return [];
  }

  const [buf] = await file.download();

  const encoding = detect(buf.subarray(0, 2000)).encoding;
  const decodedText = decode(buf, encoding === 'ISO-8859-2' ? 'Shift-JIS' : encoding);
  const csv = parse(decodedText, { columns: true, ...options });

  return csv ;
};

