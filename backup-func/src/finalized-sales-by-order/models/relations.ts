import { Firestore } from 'firebase-admin/firestore';
import { IDivisionCodeMaster } from '../../division-code-master/models/schema';
import { DivisionCodeMasterRepository } from '../../division-code-master/models/repository';
import { ISalesChannelMaster } from '../../sales-channel-master/models/schema';
import { SalesChannelMasterRepository } from '../../sales-channel-master/models/repository';
import { FinalizedShippingRepository } from '../../finalized-shipping/models/repository';
import { InventoryUnitPriceRepository } from '../../inventory-unit-price/models/repository';
import { RakutenOrderRepository } from '../../rakuten/order/models/repository';
import { AmazonOrderRepository } from '../../amazon/order/models/repository';
import { YahooOrderRepository } from '../../yahoo/order/models/repository';
import { YahooCampaignCapitalRateRepository } from '../../yahoo/campaign-capital-rate/models/repository';
import { Qoo10OrderRepository } from '../../qoo10/order/models/repository';
import { Qoo10AdCartDiscountRepository } from '../../qoo10/ad-cart-discount/models/repository';
import { Qoo10AdPromotionSettlementRepository } from '../../qoo10/ad-promotion-settlement/models/repository';
import { YahooClaimsRepository } from '../../yahoo/claims/models/repository';
import { AmazonAdsKpiRepository } from '../../amazon/ads-kpi/models/repository';
import { ProductMaster2Repository } from '../../products-master-2/models/repository';
import { IProductMaster2 } from '../../products-master-2/models/schema';
import { AmazonAdCampaignRepository } from '../../amazon/ad-campaign/models/repository';
import { AmazonCampaignToAsinRepository } from '../../amazon/campaign-to-asin/models/repository';
import { AmazonAdOthersRepository } from '../../amazon/ad-others/models/repository';
import { Qoo10AdSmartSalesRepository } from '../../qoo10/ad-smart-sales/models/repository';
import { Qoo10AdOthersRepository } from '../../qoo10/ad-others/models/repository';
import { RakutenAdCaRepository } from '../../rakuten/ad-ca/models/repository';
import { RakutenAdRppRepository } from '../../rakuten/ad-rpp/models/repository';
import { RakutenAdTdaRepository } from '../../rakuten/ad-tda/models/repository';
import { RakutenCampaignIdToProductControlCodeRepository } from '../../rakuten/campaign-id-to-product-control-code/model/repository';
import { RakutenAdOthersRepository } from '../../rakuten/ad-others/models/repository';
import { YahooItemMatchRepository } from '../../yahoo/ad-item-match/models/repository';
import { YahooMakerItemMatchRepository } from '../../yahoo/ad-maker-item-match/models/repository';
import { YahooCampaignIdToProductCodeRepository } from '../../yahoo/campaign-id-to-product-code/models/repository';
import { YahooAdOthersRepository } from '../../yahoo/ad-others/models/repository';

export class Relations {
  constructor(
    public divisionCodeMaster: IDivisionCodeMaster[],
    public salesChannelMaster: ISalesChannelMaster[],
    public productMaster2: IProductMaster2[]
  ) {}

  protected static async _init(): Promise<
    [IDivisionCodeMaster[], ISalesChannelMaster[], IProductMaster2[]]
  > {
    const dcmRepo = new DivisionCodeMasterRepository();
    const divisionCodeMaster = await dcmRepo.getAll();

    const scmRepo = new SalesChannelMasterRepository();
    const salesChannelMaster = await scmRepo.getAll();

    const prdM2 = new ProductMaster2Repository();
    const productMaster2 = await prdM2.getAll();

    return [divisionCodeMaster, salesChannelMaster, productMaster2];
  }

  static async init(): Promise<Relations> {
    const masters = await this._init();
    return new this(...masters);
  }
}

export class RakutenRelations extends Relations {
  public order = new RakutenOrderRepository();
  public adCa = new RakutenAdCaRepository();
  public adRpp = new RakutenAdRppRepository();
  public adTda = new RakutenAdTdaRepository();
  public campaign = new RakutenCampaignIdToProductControlCodeRepository();
  public adOthers = new RakutenAdOthersRepository();

  constructor(
    public divisionCodeMaster: IDivisionCodeMaster[],
    public salesChannelMaster: ISalesChannelMaster[],
    public productMaster2: IProductMaster2[],
    options?: { db?: Firestore }
  ) {
    super(divisionCodeMaster, salesChannelMaster, productMaster2);
  }

  static async init(options?: { db?: Firestore }): Promise<RakutenRelations> {
    const masters = await this._init();
    return new this(...masters, options);
  }
}

export class AmazonRelations extends Relations {
  public order = new AmazonOrderRepository();
  public kpi = new AmazonAdsKpiRepository();
  public adCampaign = new AmazonAdCampaignRepository();
  public campaign = new AmazonCampaignToAsinRepository();
  public adOthers = new AmazonAdOthersRepository();

  constructor(
    public divisionCodeMaster: IDivisionCodeMaster[],
    public salesChannelMaster: ISalesChannelMaster[],
    public productMaster2: IProductMaster2[]
  ) {
    super(divisionCodeMaster, salesChannelMaster, productMaster2);
  }

  static async init(): Promise<AmazonRelations> {
    const masters = await this._init();
    return new this(...masters);
  }
}

export class YahooRelations extends Relations {
  public order = new YahooOrderRepository();
  public campaignCapitalRate = new YahooCampaignCapitalRateRepository();
  public claims = new YahooClaimsRepository();
  public itemMatch = new YahooItemMatchRepository();
  public makerItemMatch = new YahooMakerItemMatchRepository();
  public campaign = new YahooCampaignIdToProductCodeRepository();
  public adOthers = new YahooAdOthersRepository();

  constructor(
    public divisionCodeMaster: IDivisionCodeMaster[],
    public salesChannelMaster: ISalesChannelMaster[],
    public productMaster2: IProductMaster2[]
  ) {
    super(divisionCodeMaster, salesChannelMaster, productMaster2);
  }

  static async init(): Promise<YahooRelations> {
    const masters = await this._init();
    return new this(...masters);
  }
}

export class Qoo10Relations extends Relations {
  public cartDiscount = new Qoo10AdCartDiscountRepository();
  public promotionSettlement = new Qoo10AdPromotionSettlementRepository();
  public order = new Qoo10OrderRepository();
  public adSmart = new Qoo10AdSmartSalesRepository();
  public adOthers = new Qoo10AdOthersRepository();

  constructor(
    public divisionCodeMaster: IDivisionCodeMaster[],
    public salesChannelMaster: ISalesChannelMaster[],
    public productMaster2: IProductMaster2[]
  ) {
    super(divisionCodeMaster, salesChannelMaster, productMaster2);
  }

  static async init(): Promise<Qoo10Relations> {
    const masters = await this._init();
    return new this(...masters);
  }
}
