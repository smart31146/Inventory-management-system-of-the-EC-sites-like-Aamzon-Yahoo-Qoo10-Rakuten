import { SalesChannel } from './types';

export const detectSalesChannel = (inputFormat: string): SalesChannel => {
  if (inputFormat.indexOf('楽天') !== -1) {
    return SalesChannel.Rakuten;
  } else if (inputFormat.indexOf('FBA') !== -1) {
    return SalesChannel.Amazon;
  } else if (inputFormat.indexOf('Yahoo') !== -1) {
    return SalesChannel.Yahoo;
  } else if (inputFormat.indexOf('Qoo10') !== -1) {
    return SalesChannel.Qoo10;
  } else {
    return SalesChannel.Inhouse;
  }
};
