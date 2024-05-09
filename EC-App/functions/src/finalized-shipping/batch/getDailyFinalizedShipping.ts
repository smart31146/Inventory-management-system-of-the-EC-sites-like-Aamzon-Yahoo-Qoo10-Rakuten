import { getCsvFromStorage } from '../../helper/storage/getCsvFromStorage';
import { ProductMaster3Repository } from '../../products-master-3/models/repository';
import { FinalizedShippingConverter } from '../models/converter';
import { IFinalizedShipping, IFinalizedShippingCsv } from '../models/schema';

/**
 * 日次の売上確定データCSVをストレージから取得する
 */
export const getDailyFinalizedShipping = async (
  shippingDate: Date,
  csvId: 'c009' | 'c005' | 'c011' | 'c015'
): Promise<IFinalizedShipping[]> => {
  const converter = new FinalizedShippingConverter();
  const productMaster3 = new ProductMaster3Repository();

  const tenantName = (() => {
    switch (csvId) {
      case 'c009':
        return 'FBA';
      case 'c005':
        return 'RSL';
      case 'c011':
        return 'SEIWA_YAHOO';
      case 'c015':
        return 'SEIWA_QOO10';
    }
  })();

  const csv: IFinalizedShippingCsv[] = await getCsvFromStorage(
    csvId,
    shippingDate
  );
  const productMaster3Result = await productMaster3.getAll();


  const shipping = csv.map((row) =>
    converter.fromCsvRow(tenantName, shippingDate, row, productMaster3Result)
  ).filter((v): v is IFinalizedShipping => v !== null);


  return [...shipping];
};
