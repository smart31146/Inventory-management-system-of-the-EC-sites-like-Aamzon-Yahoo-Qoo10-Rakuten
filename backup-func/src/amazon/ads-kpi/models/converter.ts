import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import {
  IAmazonAdsKpi,
  IAmazonAdsKpiDocument,
  IAmazonAdsKpiCsvRow,
} from './schema';

//-------------------------------------------------------------------------------
/**
 * Amazon：広告費キャンペーンのコンバーター
 */
//-------------------------------------------------------------------------------
export class AmazonAdsKpiConverter implements FirestoreDataConverter<IAmazonAdsKpi>
{
  //-------------------------------------------------------------------------------
  /**
   * Firestoreへのデータ設定
   * @param entity 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  toFirestore(entity: IAmazonAdsKpi): IAmazonAdsKpiDocument 
  {
    return {
      productId: entity.productId,
      click: entity.click,
      cvr: entity.cvr,
      cpc: entity.cpc,
      ctr: entity.ctr,
      adFee: entity.adFee,
      roas: entity.roas,
      cpa: entity.cpa,
      sales: entity.sales,
      conversion: entity.conversion,
      date: entity.date,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * Firestoreのデータ取得
   * @param snapshot 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromFirestore( snapshot: QueryDocumentSnapshot<IAmazonAdsKpiDocument> ): IAmazonAdsKpi 
  {
    const data = snapshot.data();
    return {
      productId: data.productId,
      click: data.click,
      cvr: data.cvr,
      cpc: data.cpc,
      adFee: data.adFee,
      ctr: data.ctr,
      roas: data.roas,
      sales: data.sales,
      cpa: data.cpa,
      conversion: data.conversion,
      date: data.date,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //-------------------------------------------------------------------------------
  /**
   * CSVデータからの取得
   *  - 連日の場合があるため、経過日数で実績額を按分する
   * 
   * @param row 
   * @returns 
   */
  //-------------------------------------------------------------------------------
  fromCsvRow(row: IAmazonAdsKpiCsvRow): IAmazonAdsKpi
  {
    const productId = row['商品'] || '';
    const newProductId = productId.substring(productId.indexOf('-') + 1);

    const click = Number(row['クリック数']) || 0;
    const cvr = Number(row['コンバージョン率']) || 0;

    const conversion = click * cvr;

    const ad = Number(row['広告費(JPY)']) || 0;

    const cpa = ad/conversion;

    return {
      productId: newProductId,
      click,
      cvr,
      cpa,
      cpc: Number(row['平均クリック単価 (CPC)(JPY)']) || 0,
      ctr: Number(row['クリック率  (CTR）']) || 0,
      roas: Number(row['ROAS']) || 0,
      sales: Number(row['売上(JPY)']) || 0,
      adFee: ad,
      conversion,
      date: row['date'] || 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
