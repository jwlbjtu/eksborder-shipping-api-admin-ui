export interface Carrier extends CarrierCreateData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarrierCreateData extends CarrierUpdateData {
  clientId: string;
  clientSecret: string;
}

export interface CarrierUpdateData {
  carrierName: string;
  accountName: string;
  description: string;
  facilities: Facility[];
  services: Service[];
  returnAddress: Address;
  shipperId?: string;
  isActive: boolean;
}

export interface Facility {
  pickup: string;
  facility: string;
}

export interface Service {
  key: string;
  name: string;
}

export interface Address {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  email?: string;
  phone?: string;
}
