import { Address, Service } from './carrier';

export interface ShippingRecord {
  id: string;
  accountName: string;
  carrierAccount: string;
  carrier: string;
  provider?: string;
  service: Service;
  facility?: string;
  toAddress: Address;
  shippingId?: string;
  trackingId: string;
  rate: number;
  createdAt: Date;
  manifested: boolean;
  labels: Label[];
  forms?: Form[];
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

export interface Form {
  formData: string;
  format: string;
  encodeType: string;
}
