import { Address, Service } from './carrier';

export interface ShippingRecord {
  id: string;
  orderId: string;
  accountName?: string;
  carrierAccount?: string;
  carrier?: string;
  provider?: string;
  service?: IService;
  facility?: string;
  sender: OrderAddress;
  toAddress: OrderAddress;
  return: OrderAddress;
  packageList: PackageInfo[];
  orderAmount?: number;
  orderCurrency?: Currency;
  shipmentOptions: {
    shipmentDate: string;
  };
  customDeclaration?: CustomDeclaration;
  customItems?: Item[];
  items?: Item[];
  status: string;
  accountingStatus?: string;
  accountingDiff?: number;
  accountingWeight?: number;
  accountingWeightUnit?: WeightUnit;
  trackingId?: string;
  trackingStatus?: string;
  shippingId?: string;
  rate?: ShipmentRate;
  labels?: LabelData[];
  labelUrlList?: RuiYunLableUrl[];
  invoiceUrl?: string;
  forms?: FormData[];
  manifested: boolean = false;
  errors?: string[];
  labelLoading: boolean = false;
  createdAt: string;
  updatedAt: Date;
}

export interface RuiYunLableUrl {
  labelUrl: string;
  type: string;
}

export interface ShipmentRate {
  amount: number;
  currency: Currency | string;
}

export interface FormData {
  data: string;
  format: string;
  encodeType: string;
}

export interface LabelData {
  carrier: string;
  service: string;
  tracking: string;
  createdOn: Date;
  data: string;
  format: string;
  encodeType: string;
  isTest: boolean;
}

export interface CustomDeclaration {
  typeOfContent: string;
  incoterm: string;
  exporterRef?: string;
  importerRef?: string;
  invoice?: string;
  nonDeliveryHandling: string;
  license?: string;
  certificate?: string;
  signingPerson: string;
  taxIdType?: string;
  eelpfc?: string;
  b13a?: string;
  notes?: string;
}

export interface Item {
  id?: string;
  itemTitle: string;
  quantity: number;
  itemWeight: number;
  totalWeight: number;
  itemWeightUnit: WeightUnit;
  itemValue: number;
  totalValue: number;
  itemValueCurrency: Currency;
  country?: Country;
  sku?: string;
  hsTariffNumber?: string;
}

export interface OrderAddress extends Record<string, any> {
  id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country: Country;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip?: string;
}

export interface PackageInfo {
  packageType: string;
  dimentions: Dimentions;
  weight: Weight;
}

export interface IWeight {
  value: number;
  unitOfMeasure: 'BL' | 'OZ' | 'KG' | 'G';
}

export interface IDimension {
  length: number;
  width: number;
  height: number;
  unitOfMeasure: 'IN' | 'CM';
}

export interface Label {
  trackingId: string;
  createdOn: Date;
  labelData: string;
  encodeType: string;
  format: string;
  parcelType?: string;
}

export interface Form {
  formData: string;
  format: string;
  encodeType: string;
}
