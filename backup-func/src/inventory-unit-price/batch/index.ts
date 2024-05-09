import { getCsvFromStorage } from '../../helper/storage/getCsvFromStorage';
import { InventoryUnitPriceConverter } from '../models/converter';
import { InventoryUnitPriceRepository } from '../models/repository';
import { IInventoryUnitPriceCSV } from '../models/schema';

/**
 * 在庫単価同期バッチ
 */
export const inventoryUnitPriceBatch = async (aggregatedAt: Date) => {
  const converter = new InventoryUnitPriceConverter();
  aggregatedAt.setHours(0,0,0,0)
  aggregatedAt.setDate(1)
  let date = new Date(aggregatedAt.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const csv: IInventoryUnitPriceCSV[] = await getCsvFromStorage(
    'c004',
    date,
    { fromLine: 7 }
  );
  const unitPrices = csv.map((row) => converter.fromCsvRow(date, row));

  const repo = new InventoryUnitPriceRepository();
  await repo.batchCreate(unitPrices);
};
