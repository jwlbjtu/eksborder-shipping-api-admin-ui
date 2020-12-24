import dhleCommerceLogo from '../../assets/images/carriers/dhl-ecommerce-logo.svg';
import fedexLogo from '../../assets/images/carriers/fedex-logo.svg';
import upsLogo from '../../assets/images/carriers/ups-logo.svg';
import uspsLogo from '../../assets/images/carriers/usps-logo.svg';
import eksShippingLogo from '../../assets/images/logo-rectangular.png';

export const CARRIERS = {
  DHL_ECOMMERCE: 'DHL eCommerce',
  FEDEX: 'FedEx',
  UPS: 'UPS',
  USPS: 'USPS'
};

export const GET_CARRIER_LOGO = (carrier: string): string => {
  switch (carrier) {
    case CARRIERS.DHL_ECOMMERCE:
      return dhleCommerceLogo;
    case CARRIERS.FEDEX:
      return fedexLogo;
    case CARRIERS.UPS:
      return upsLogo;
    case CARRIERS.USPS:
      return uspsLogo;
    default:
      return eksShippingLogo;
  }
};

export const EKSBORDER_ADDRESS = {
  company: 'Eksborder Inc',
  street1: '59 Apsley Street',
  street2: 'Suite 11A',
  city: 'Hudson',
  state: 'MA',
  postalCode: '01749',
  country: 'US'
};

export const DEFAULT_ADDRESS_FORM_DATA = {
  company: EKSBORDER_ADDRESS.company,
  street1: EKSBORDER_ADDRESS.street1,
  street2: EKSBORDER_ADDRESS.street2,
  city: EKSBORDER_ADDRESS.city,
  state: EKSBORDER_ADDRESS.state,
  postalCode: EKSBORDER_ADDRESS.postalCode,
  country: EKSBORDER_ADDRESS.country
};

// **************  SAMPLE DATA  ******************** //
export const CARRIERS_SAMPLE_DATA = [
  {
    key: 1,
    carrier: CARRIERS.DHL_ECOMMERCE,
    name: 'DHL eCommerce 小包账号',
    description: '用于FLAT，GOUND之类的小包业务',
    active: true
  },
  {
    key: 2,
    carrier: CARRIERS.FEDEX,
    name: 'FDEX美国本土派送账号',
    description: '用于Amazon电商一件代发业务',
    active: true
  },
  {
    key: 3,
    carrier: CARRIERS.UPS,
    name: 'UPS国际账号',
    description: '用于中国和美国间的业务',
    active: false
  },
  {
    key: 4,
    carrier: CARRIERS.USPS,
    name: 'USPS美国小包账号',
    description: '用于美国本地的小包业务',
    active: false
  }
];
