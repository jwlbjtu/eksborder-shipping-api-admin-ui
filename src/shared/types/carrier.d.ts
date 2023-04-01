export interface Carrier extends CarrierUpdateData {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CarrierUpdateData {
  carrierName: string;
  accountName: string;
  description: string;
  clientId: string;
  clientSecret: string;
  accessKey?: string;
  accountNum?: string;
  hubId?: string;
  returnAddress?: Address;
  testClientId?: string;
  testClientSecret?: string;
  testAccessKey?: string;
  testAccountNum?: string;
  testHubId?: string;
  facilities?: Facility[];
  testFacilities?: Facility[];
  services: Service[];
  shipperId?: string;
  regions: string[];
  isActive: boolean;
}

export interface Facility {
  pickup: string;
  facility: string;
}

export interface Service {
  key: string;
  id?: string;
  name: string;
}

export interface Address {
  name?: string;
  attentionName?: string;
  company?: string;
  taxIdNum?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  email?: string;
  phone?: string;
  shipperNum?: string;
}

export interface ThirdPartyAccountData {
  name: string;
  carrier: string;
  accountNum: string;
  zipCode?: string;
  countryCode?: string;
  service: Service;
  region: string;
  condition: ThirdPartyCondition;
  price?: ThirdPartyPrice;
  zones?: string[];
  zoneMap?: ThirdPartyZoneMap[];
  rates: FeeRate[];
  carrierRef: string;
}

export interface ThirdPartyAccount extends ThirdPartyAccountData {
  id: Types.ObjectId;
}

export interface PriceTableData {
  name: string;
  carrier: string;
  service: IService;
  region: string;
  condition: ThirdPartyCondition;
  price?: ThirdPartyPrice;
  zones?: string[];
  zoneMap?: ThirdPartyZoneMap[];
  rates: FeeRate[];
  carrierRef: string;
}

export interface PriceTable extends PriceTableData {
  id: Types.ObjectId;
}

export interface ThirdPartyCondition {
  minWeight?: number;
  maxWeight?: number;
  weightUnit?: string;
}

export interface ThirdPartyPrice {
  weightUnit: string;
  currency: string;
  data: Record<string, string>[];
}

export interface ThirdPartyZoneMap {
  zone: string;
  maps: string;
}

export interface FeeRate {
  ratebase: string;
  weightUnit?: WeightUnit;
  currency: Currency;
  rate: number;
  ratetype: CarrierRateType;
}

export interface CustomServiceCondition {
  type: string;
  fields: { [key: string]: any };
}

export interface SubService {
  name: string;
  code: string;
  conditions: CustomServiceCondition[];
  isBackup: boolean;
}

export interface CustomService {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  carrierId: Types.ObjectId;
  services: SubService[];
  active: boolean;
}

export interface CustomServiceParams {
  _id?: Types.ObjectId;
  name?: string;
  description?: string;
  carrierId?: Types.ObjectId;
  services?: SubService[];
  active?: boolean;
}
