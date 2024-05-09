export const BatchTypes = [
    {
        code: 'F001',
        batch: 'finalized-shipping-amazon',
        label: '【C009】finalized-shipping-amazon',
        func: 'api-batch-finalizedShippingAmazonOnCall'
    },
    {
        code: 'F002',
        batch: 'finalized-shipping-rakuten',
        label: '【C005】finalized-shipping-rakuten',
        func: 'api-batch-finalizedShippingRakutenOnCall'
    },
    {
        code: 'F003',
        batch: 'finalized-shipping-yahoo',
        label: '【C011】finalized-shipping-yahoo',
        func: 'api-batch-finalizedShippingYahooOnCall'
    },
    {
        code: 'F004',
        batch: 'finalized-shipping-qoo10',
        label: '【C015】finalized-shipping-qoo10',
        func: 'api-batch-finalizedShippingQoo10OnCall'
    },
    {//DONE
        code: 'S002',
        batch: 'division-code-master',
        label: '【S002】division-code-master',
        func: 'api-batch-divisionCodeMasterOnCall'
    },
    {//DONE
        code: 'S003',
        batch: 'sales-channel-master',
        label: '【S003】sales-channel-master',
        func: 'api-batch-salesChannelMasterOnCall'
    },
    {//DONE
        code: 'S013',
        batch: 'cost-master',
        label: '【S013】cost-master',
        func: 'api-batch-costMasterOnCall'
    },
    {//DONE
        code: 'S014',
        batch: 'products-master-2',
        label: '【S014】products-master-2',
        func: 'api-batch-productsMaster2OnCall'
    },
    {//DONE
        code: 'S015',
        batch: 'products-master-3',
        label: '【S015】products-master-3',
        func: 'api-batch-productsMaster3OnCall'
    },
    /*{
        蔵奉行_在庫単価データCSVは未使用のためコメントアウト
        code: 'C004',
        batch: 'inventory-unit-price',
        label: '【C004】inventory-unit-price',
        func: 'api-batch-invantoryUnitPriceOnCall'
    },*/
    {//DONE
        code: 'C005',
        batch: 'rakuten/order',
        channel: 'rakuten',
        label: '【C005】rakuten/order',
        func: 'api-batch-ordersOnCall'
    },
    {//DONE
        code: 'C009',
        batch: 'amazon/order',
        label: '【C009】amazon/order',
        channel: 'amazon',
        func: 'api-batch-ordersOnCall'
    },
    {//DONE
        code: 'C011',
        batch: 'yahoo/order',
        channel: 'yahoo',
        label: '【C011】yahoo/order',
        func: 'api-batch-ordersOnCall'
    },
    {//DONE
        code: 'C015',
        batch: 'qoo10/order',
        channel: 'qoo10',
        label: '【C015】qoo10/order',
        func: 'api-batch-ordersOnCall'
    },
    {
        code: 'C006',
        batch: 'rakuten/ad-rpp',
        channel: 'rakuten',
        label: '【C006】rakuten/ad-rpp',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C007',
        batch: 'rakuten/ad-ca',
        channel: 'rakuten',
        label: '【C007】rakuten/ad-ca',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C008',
        batch: 'rakuten/ad-tda',
        channel: 'rakuten',
        label: '【C008】rakuten/ad-tda',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S004',
        batch: 'rakuten/ad-others',
        channel: 'rakuten',
        label: '【S004】rakuten/ad-others',
        func :'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S005',
        batch: 'rakuten/deal-to-product-control',
        channel: 'rakuten',
        label: '【S005】rakuten/deal-to-product-control',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S006',
        batch: 'rakuten/campaign-id-to-product-control-code',
        channel: 'rakuten',
        label: '【S006】rakuten/campaign-id-to-product-control-code',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C010',
        batch: 'amazon/ad-campaign',
        channel: 'amazon',
        label: '【C010】amazon/ad-campaign',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C019',
        batch: 'amazon/ads-kpi',
        channel: 'amazon',
        label: '【C019】amazon/ads-kpi',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S007',
        batch: 'amazon/ad-others',
        channel: 'amazon',
        label: '【S007】amazon/ad-others',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S008',
        batch: 'amazon/campaign-to-asin',
        channel: 'amazon',
        label: '【S008】amazon/campaign-to-asin',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C012',
        batch: 'yahoo/ad-item-match',
        channel: 'yahoo',
        label: '【C012】yahoo/ad-item-match',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C013',
        batch: 'yahoo/ad-maker-item-match',
        channel: 'yahoo',
        label: '【C013】yahoo/ad-maker-item-match',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S009',
        batch: 'yahoo/ad-others',
        channel: 'yahoo',
        label: '【S009】yahoo/ad-others',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S010',
        batch: 'yahoo/campaign-id-to-product-code',
        channel: 'yahoo',
        label: '【S010】yahoo/campaign-id-to-product-code',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'S011',
        batch: 'yahoo/campaign-capital-rate',
        channel: 'yahoo',
        label: '【S011】yahoo/campaign-capital-rate', 
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C016',
        batch: 'qoo10/ad-smart-sales',
        channel: 'qoo10',
        label: '【C016】qoo10/ad-smart-sales',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C017',
        batch: 'qoo10/ad-cart-discount',
        channel: 'qoo10',
        label: '【C017】qoo10/ad-cart-discount',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C018',
        batch: 'qoo10/ad-promotion-settlement',
        channel: 'qoo10',
        label: '【C018】qoo10/ad-promotion-settlement',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C012-qoo10',
        batch: 'qoo10/ad-others',
        channel: 'qoo10',
        label: '【C012】qoo10/ad-others',
        func: 'api-batch-advertisingFeeOnCall'
    },
    {
        code: 'C014',
        batch: 'yahoo/claims',
        channel: 'yahoo',
        label: '【C014】yahoo/claims',
        func: 'api-batch-advertisingFeeOnCall',
    },
]
