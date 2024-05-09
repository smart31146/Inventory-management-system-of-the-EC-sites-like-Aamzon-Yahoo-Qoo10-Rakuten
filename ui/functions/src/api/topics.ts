/**
 * subscribe している topic の一覧
 * - この一覧にて topic がユニークな値となるように管理する
 * - topic を発行する際にはこの一覧を参照し、ハードコーディングを避ける
 */
export const topics = {
  batch: {
    finalizedShippingAmazon: 'batch-finalized-shipping-amazon',
    finalizedShippingRakuten: 'batch-finalized-shipping-rakuten',
    finalizedShippingYahoo: 'batch-finalized-shipping-yahoo',
    finalizedShippingQoo10: 'batch-finalized-shipping-qoo10',
    productsMaster: 'batch-products-master',
    productsMaster2: 'batch-products-master-2',
    productsMaster3: 'batch-products-master-3',
    salesChannelMaster: 'batch-sales-channel-master',
    costMaster: 'batch-cost-master',
    advertisingFee: 'batch-advertising-fee',
    claims: 'batch-claims',
    divisionCodeMaster: 'batch-division-code-master',
    invantoryUnitPrice: 'batch-inventory-unit-price',
    orders: 'batch-orders',
  },
  calc: {
    advertisingFee: 'calc-advertising-fee',
    finalizedSales: 'calc-finalized-sales',
  },
  output: {
    finalizedSales: 'output-finalized-sales',
    clearSummarySheets: 'output-clear-sheets',
  },
  workflow: {
    dailyBatch: 'workflow-daily-batch',
    dailyCalc: 'workflow-daily-calc',
    monthly: 'workflow-monthly',
  },
};
