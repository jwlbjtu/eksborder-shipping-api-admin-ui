import { Address } from './carrier';

export interface ShippingRecord {
  id: string;
  accountName: string;
  carrier: string;
  provider?: string;
  service: string;
  facility?: string;
  toAddress: Address;
  shippingId?: string;
  trackingId: string;
  rate: number;
  createdAt: Date;
  manifested: boolean;
  labels: Label[];
  packageInfo: {
    weight: IWeight;
    dimension?: IDimension;
  };
  userRef: string;
  billingRef: string;
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
