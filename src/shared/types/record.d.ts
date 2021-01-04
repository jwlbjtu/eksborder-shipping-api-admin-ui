import { Address } from './carrier';

export interface ShippingRecord {
  id: string;
  accountName: string;
  carrier: string;
  provider?: string;
  service: string;
  toAddress: Address;
  shippingId?: string;
  trackingId: string;
  rate: number;
  createdAt: Date;
  manifested: boolean;
  labels: Label[];
  userRef: string;
  billingRef: string;
}

export interface Label {
  trackingId: string;
  createdOn: Date;
  labelData: string;
  encodeType: string;
  format: string;
  parcelType?: string;
}
