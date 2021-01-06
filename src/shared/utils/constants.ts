import dhleCommerceLogo from '../../assets/images/carriers/dhl-ecommerce-logo.svg';
import fedexLogo from '../../assets/images/carriers/fedex-logo.svg';
import upsLogo from '../../assets/images/carriers/ups-logo.svg';
import uspsLogo from '../../assets/images/carriers/usps-logo.svg';
import eksShippingLogo from '../../assets/images/logo-rectangular.png';
import pbLogo from '../../assets/images/carriers/pitney-bowes-logo.png';

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

export const DHL_ECOMMERCE_DOMESTIC_SERVICES = [
  { key: 'FLAT', name: 'DHL Smartmail Flats' },
  { key: 'EXP', name: 'DHL Parcel Expedited' },
  { key: 'MAX', name: 'DHL Parcel Expedited Max' },
  { key: 'GND', name: 'DHL Parcel Ground' }
];

export const CARRIER_SERVIES = {
  [CARRIERS.DHL_ECOMMERCE]: DHL_ECOMMERCE_DOMESTIC_SERVICES
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

export const SERVER_ROUTES = {
  CARRIER: '/carrier',
  USERS: '/users',
  BILLINGS: '/billings',
  API: '/api',
  ACCOUNT: '/account',
  RECORDS: '/records'
};

export const DEFAULT_SERVER_HOST = 'http://localhost:5000';

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
