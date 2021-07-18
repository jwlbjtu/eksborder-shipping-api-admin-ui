import dhleCommerceLogo from '../../assets/images/carriers/dhl-ecommerce-logo.svg';
import fedexLogo from '../../assets/images/carriers/fedex-logo.svg';
import upsLogo from '../../assets/images/carriers/ups-logo.svg';
import uspsLogo from '../../assets/images/carriers/usps-logo.svg';
import eksShippingLogo from '../../assets/images/logo-rectangular.png';
import pbLogo from '../../assets/images/carriers/pitney-bowes-logo.png';

export enum Currency {
  USD = 'USD',
  RMB = 'RMB'
}

export const CURRENCY_SIGNS: Record<string, string> = {
  [Currency.USD]: '$',
  [Currency.RMB]: '￥'
};

export enum CarrierRateType {
  FLAT = 'flat',
  PERSENTAGE = 'persentage'
}

export const RATE_BASES = {
  ORDER: '每票',
  PACKAGE: '每件',
  WEIGHT: '重量'
};

export enum Country {
  USA = 'US',
  CHINA = 'CN'
}

export const COUNTRY_NAMES = {
  [Country.USA]: 'United States',
  [Country.CHINA]: 'China'
};

export enum WeightUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
  LB = 'lb'
}

export const CARRIERS = {
  DHL_ECOMMERCE: 'DHL eCommerce',
  FEDEX: 'FedEx',
  UPS: 'UPS',
  USPS: 'USPS',
  PITNEY_BOWES: 'Pitney Bowes'
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
    case CARRIERS.PITNEY_BOWES:
      return pbLogo;
    default:
      return eksShippingLogo;
  }
};

export const CARRIER_REGIONS = {
  US_DOMESTIC: 'US_DOMESTIC',
  US_INTERNATIONAL: 'US_INTERNATIONAL',
  CN_IMPORT: 'CN_IMPORT'
};

export const CARRIER_REGIONS_TEXTS = {
  [CARRIER_REGIONS.US_DOMESTIC]: 'US Domestic',
  [CARRIER_REGIONS.US_INTERNATIONAL]: 'US International',
  [CARRIER_REGIONS.CN_IMPORT]: 'China Import'
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

export const CLIENT_MANAGE_OPERATIONS = {
  ACCOUNT: '用户信息',
  BILLING_INFO: '账单信息',
  API_KEYS: 'API秘钥',
  CARRIERS_CONFIG: '物流授权',
  SHIPPING_RECORDS: '邮递记录'
};

export const DHL_ECOMMERCE_SERVICES = [
  { key: 'FLAT', name: 'DHL Smartmail Flats' },
  { key: 'EXP', name: 'DHL Parcel Expedited' },
  { key: 'MAX', name: 'DHL Parcel Expedited Max' },
  { key: 'GND', name: 'DHL Parcel Ground' },
  { key: 'PLT', name: 'DHL Parcel International Direct' },
  { key: 'PLY', name: 'DHL Parcel International Standard' },
  { key: 'PKY', name: 'DHL Packet International' }
];

export const UPS_SERVICES = [
  { key: 'Express', id: '07', name: 'UPS Worldwide Express' },
  { key: 'Expedited', id: '08', name: 'UPS Worldwide Expedited' },
  { key: 'Saver', id: '65', name: 'UPS Worldwide Saver' },
  { key: '2nd Day Air', id: '02', name: 'UPS 2nd Day Air' },
  { key: '2nd Day Air A.M.', id: '59', name: 'UPS 2nd Day Air A.M.' },
  { key: '3 Day Select', id: '12', name: 'UPS 3 Day Select' },
  { key: 'Ground', id: '03', name: 'UPS Ground' },
  { key: 'Next Day Air', id: '01', name: 'UPS Next Day Air' },
  { key: 'Next Day Air Early', id: '14', name: 'UPS Next Day Air Early' },
  { key: 'Next Day Air Saver', id: '13', name: 'UPS Next Day Air Saver' },
  { key: 'Surepost Light', id: '92', name: 'UPS Surepost Light' },
  { key: 'Surepost', id: '93', name: 'UPS Surepost' }
];

export const USPS_SERVICES = [
  { key: 'PMExpress', id: '3', name: 'Priority Mail Express' },
  { key: 'PM', id: '1', name: 'Priority Mail' },
  { key: 'FCM', id: '61', name: 'First Class Mail' },
  {
    key: 'PMExpress International',
    id: '1',
    name: 'Priority Mail Express International'
  },
  { key: 'PM International', id: '2', name: 'Priority Mail International' }
];

export const USPS_INTL_SERVICE_IDS = {
  EXPRESS_INTL: '1',
  PRIORITY_INTL: '2'
};

export const USPS_INTL_SERVICE_IDS_LIST = [
  USPS_INTL_SERVICE_IDS.EXPRESS_INTL,
  USPS_INTL_SERVICE_IDS.PRIORITY_INTL
];

export const FEDEX_SERVICES = [
  { key: 'INTERNATIONAL_ECONOMY', name: 'FedEx International Economy' },
  { key: 'INTERNATIONAL_PRIORITY', name: 'FedEx International PRIORITY' },
  { key: 'FEDEX_GROUND', name: 'FedEx Ground' },
  { key: 'GROUND_HOME_DELIVERY', name: 'FedEx Gound Home Delivery' }
];

export const CARRIER_SERVIES = {
  [CARRIERS.DHL_ECOMMERCE]: DHL_ECOMMERCE_SERVICES
};

export const DHL_ECOMMERCE_FACILITIES = ['USBOS1', 'USLAX1', 'USEWR1'];

export const HTTP_ERROR_CODE_MESSAGE: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

export const USER_ROLES = {
  ADMIN_SUPER: 'admin_super',
  ADMIN: 'admin',
  API_USER: 'customer'
};

export const ROLES_TO_DISPLAY = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.ADMIN_SUPER]: 'Super',
  [USER_ROLES.API_USER]: 'Client'
};

export const UI_ROUTES = {
  CARRIERS: '/carriers'
};

export const SERVER_ROUTES = {
  CARRIER: '/carrier',
  USERS: '/users',
  BILLINGS: '/billings',
  API: '/api',
  ACCOUNT: '/account',
  RECORDS: '/records',
  CSV: '/csv',
  THIRDPARTY_ACCOUNTS: '/thirdparties',
  PRICE_TABLES: '/priceTable'
};

export const DEFAULT_SERVER_HOST =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BENKEND_URL
    : 'http://localhost:5000';

export const FEE_TYPE_KEYS = {
  PROPORTIONS: 'proportions',
  AMOUNT: 'amount'
};

export const FEE_TYPE = {
  [FEE_TYPE_KEYS.PROPORTIONS]: {
    key: 'proportions',
    name: '百分比'
  },
  [FEE_TYPE_KEYS.AMOUNT]: {
    key: 'amount',
    name: '固定额度'
  }
};

export const FEE_CAL_BASE_KEYS = {
  ORDER: 'order',
  WEIGHT: 'weight'
};

export const FEE_CALCULATE_BASE = {
  [FEE_CAL_BASE_KEYS.ORDER]: {
    key: 'order',
    name: '每票'
  },
  [FEE_CAL_BASE_KEYS.WEIGHT]: {
    key: 'weight',
    name: '每公斤'
  }
};

export const FILE_FORMATS = {
  standard: 'standard',
  thermal: 'thermal'
};

export const FILE_TYPES = {
  pdf: 'PDF',
  png: 'PNG',
  csv: 'CSV'
};

export const FILE_FORMAT_SIZES = {
  [FILE_FORMATS.standard]: [8.5, 11], // A4
  [FILE_FORMATS.thermal]: [4, 6]
};

export const FILE_FORMAT_SIZES_PDF_LIB = {
  [FILE_FORMATS.standard]: [595.28, 841.89], // A4
  [FILE_FORMATS.thermal]: [288, 432]
};

export const PACKING_SLIP_FOMAT_SIZES = {
  [FILE_FORMATS.standard]: {
    fontSize: 10,
    header: {
      background: { x: 0.2, y: 0.2, w: 8.1, h: 0.21 },
      content: { x: 4.25, y: 0.3 }
    },
    sender: { x: 0.3, y: 0.6, step: 0.17 },
    orderInfo: { x: 6, y: 0.6, step: 0.17, distance: 0.1 },
    receipent: { title: { x: 2.5, y: 1.6 }, x: 3.2, y: 1.6, step: 0.17 },
    table: {
      header: { x: 0.3, y: 2.6, x2: 4.5, step: 1 },
      headerDivider: { x1: 0.3, y1: 2.7, x2: 8, y2: 2.7 },
      items: { x: 0.3, y: 3, x2: 4.5, x_step: 1, y_step: 0.2 }
    },
    foorterDivider: { x1: 0.3, x2: 8, y_step: 0.3 },
    subTotal: { x1: 6.5, x2: 7.5, y_step: 0.2 },
    sample: { x: 50, y: 10, angle: 30, font_size: 180 }
  },
  [FILE_FORMATS.thermal]: {
    fontSize: 8,
    header: {
      background: { x: 0, y: 0.1, w: 4, h: 0.21 },
      content: { x: 2, y: 0.2 }
    },
    sender: { x: 0.2, y: 1.2, step: 0.14 },
    orderInfo: { x: 1.1, y: 0.5, step: 0.14, distance: 0.05 },
    receipent: { title: { x: 1.9, y: 1.2 }, x: 2.2, y: 1.2, step: 0.14 },
    table: {
      header: { x: 0.1, y: 2.1, x2: 2.5, step: 0.5 },
      headerDivider: { x1: 0, y1: 2.2, x2: 4, y2: 2.2 },
      items: { x: 0.1, y: 2.4, x2: 2.5, x_step: 0.5, y_step: 0.2 }
    },
    foorterDivider: { x1: 0, x2: 4, y_step: 0.2 },
    subTotal: { x1: 2.5, x2: 3.5, y_step: 0.2 },
    sample: { x: 30, y: 10, angle: 30, font_size: 80 }
  }
};

export const FILE_FORMAT_TEXTS = {
  [FILE_FORMATS.standard]: '8.5x11in',
  [FILE_FORMATS.thermal]: '4x6in'
};

export enum ShipmentStatus {
  PENDING = 'Pending',
  FULFILLED = 'Shipped'
}
