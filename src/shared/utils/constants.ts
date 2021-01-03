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
  PRICE: 'price',
  ORDER: 'order',
  WEIGHT: 'weight'
};

export const FEE_CALCULATE_BASE = {
  [FEE_CAL_BASE_KEYS.PRICE]: {
    key: 'price',
    name: '价格'
  },
  [FEE_CAL_BASE_KEYS.ORDER]: {
    key: 'order',
    name: '每票'
  },
  [FEE_CAL_BASE_KEYS.WEIGHT]: {
    key: 'weight',
    name: '每公斤'
  }
};

// **************  SAMPLE DATA  ******************** //
export const USER_DATA = {
  avatar:
    'https://gravatar.com/avatar/3b18fc2121b873de218618c160f1a018?d=https%3A%2F%2Fassets.codepen.io%2Finternal%2Favatars%2Fusers%2Fdefault.png&fit=crop&format=auto&height=80&version=0&width=80',
  name: 'Wenlong Jiang',
  email: 'wenlong.jiang@eksborder.com',
  phone: {
    countryCode: '1',
    number: '6173010512'
  }
};

export const CARRIERS_SAMPLE_DATA = [
  {
    key: 1,
    carrier: CARRIERS.DHL_ECOMMERCE,
    name: 'DHL eCommerce 小包账号',
    description: '用于FLAT，GOUND之类的小包业务',
    services: DHL_ECOMMERCE_DOMESTIC_SERVICES,
    facilities: DHL_ECOMMERCE_FACILITIES,
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

export const ADMIN_SAMPLE_DATA = [
  {
    key: 1,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    username: 'RCUser',
    firstname: 'Ryan',
    lastname: 'Chui',
    email: 'ryan.chui@eksborder.com',
    countryCode: '1',
    phone: '6173010512',
    role: 'Super',
    date: '2019/12/24',
    active: true
  },
  {
    key: 2,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    username: 'JRUser',
    firstname: 'Jeffrey',
    lastname: 'Rose',
    email: 'jeff.rose@eksborder.com',
    countryCode: '1',
    phone: '6173010512',
    role: 'Admin',
    date: '2020/04/13',
    active: false
  },
  {
    key: 3,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    username: 'JsonCUser',
    firstname: 'Json',
    lastname: 'Cai',
    email: 'jason.cai@eksborder.com',
    countryCode: '1',
    phone: '6173010512',
    role: 'Admin',
    date: '2020/08/18',
    active: true
  }
];

export const CLIENT_SAMPLE_DATA = [
  {
    key: 1,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    company: '全日通',
    username: 'CXUser',
    firstname: '霄',
    lastname: '陈',
    email: 'chen.xiao@eksborder.com',
    countryCode: '86',
    phone: '18456239393',
    date: '2019/12/24',
    balance: '986.78',
    apiToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTgzYzU1YTRiYzhkYTAxMjgzZjY4NSIsImZ1bGxOYW1lIjoiSmFzb24gQ2FpIiwiZW1haWwiOiJqYXNvbkBla3Nib3JkZXIuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNTk5NjE4MTMzfQ.tbzL5pSVWj6s3_uq55arg-2YZPPVzcU1x5kcCcXLCtA',
    active: true
  },
  {
    key: 2,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    company: '新锐物流',
    username: 'JRUser',
    firstname: '老板',
    lastname: '杜',
    email: 'du.laoban@eksborder.com',
    countryCode: '86',
    phone: '13617301012',
    date: '2020/04/13',
    balance: '10.78',
    apiToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTgzYzU1YTRiYzhkYTAxMjgzZjY4NSIsImZ1bGxOYW1lIjoiSmFzb24gQ2FpIiwiZW1haWwiOiJqYXNvbkBla3Nib3JkZXIuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNTk5NjE4MTMzfQ.tbzL5pSVWj6s3_uq55arg-2YZPPVzcU1x5kcCcXLCtA',
    active: false
  }
];

export const CLIETN_BILLING_DATA = {
  '1': [
    {
      key: 1,
      date: '2020-09-09',
      description: 'DHL eCommerce, GND, 4340909005031521',
      carrierAccount: 'DHL_eCommerce_JC',
      shippingCost: 11.11,
      fee: 2.11,
      total: 13.22,
      isPayment: true,
      balance: 986.78
    },
    {
      key: 2,
      date: '2020-09-08',
      description: '用户充值',
      total: 1000.0,
      isPayment: false,
      balance: 1000.0
    }
  ],
  '2': [
    {
      key: 3,
      date: '2020-09-09',
      description: 'DHL eCommerce, GND, 4340909005031521',
      carrierAccount: 'DHL_eCommerce_JC',
      shippingCost: 11.11,
      fee: 2.11,
      total: 13.22,
      isPayment: true,
      balance: 986.78
    },
    {
      key: 4,
      date: '2020-09-08',
      description: '用户充值',
      total: 1000.0,
      isPayment: false,
      balance: 1000.0
    }
  ]
};

export const CLIENT_CARRIERS_DATA = {
  '1': [
    {
      key: 1,
      name: 'Client-DHL-eCommerce',
      accountId: '4n5pxq24kpiob12og9',
      carrier: CARRIERS.DHL_ECOMMERCE,
      connectedAccount: 'DHL eCommerce 小包账号',
      services: DHL_ECOMMERCE_DOMESTIC_SERVICES,
      facilities: DHL_ECOMMERCE_FACILITIES,
      fee: 0.2,
      feeType: 'amount',
      feeCalBase: 'order',
      remark: '测试合作账号',
      date: '2020/12/18',
      active: true
    }
  ],
  '2': [
    {
      key: 1,
      name: 'Client-DHL-eCommerce',
      accountId: '4n5pxq24kpiob12og9',
      carrier: CARRIERS.DHL_ECOMMERCE,
      connectedAccount: 'DHL eCommerce 小包账号',
      services: DHL_ECOMMERCE_DOMESTIC_SERVICES,
      facility: DHL_ECOMMERCE_FACILITIES,
      fee: 0.2,
      feeType: 'amount',
      feeCalBase: 'order',
      remark: '测试合作账号',
      date: '2020/12/18',
      active: false
    }
  ]
};
