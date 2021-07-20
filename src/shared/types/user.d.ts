import { Facility, Service } from './carrier';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserData {
  id: Types.ObjectId;
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  email: string;
  countryCode: string;
  phone: string;
  companyName?: string;
  logoImage?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  token_type: string;
  token: string;
  tokenExpire: number;
}

export interface PasswordFormValue {
  password: string;
  'new-password': string;
}

export interface UpdateUserSelf {
  companyName?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  referalName?: string;
}

export interface UpdateUserResponse {
  id: string;
  companyName?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  logoImage?: string;
  referalName?: string;
}

export interface UpdateClientData extends UpdateUserSelf {
  minBalance: number;
  isActive: boolean;
}

export interface UpdateUserData extends UpdateClientData {
  role: string;
}

export interface CreateUserData extends UpdateUserData {
  password: string;
}

export interface User extends CreateUserData {
  id: string;
  address?: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  logoImage?: string;
  balance: number;
  currency: string;
  apiToken?: string;
  updatedAt: Date;
}

export interface CreateUserCarrierData {
  accountName: string;
  carrier: string;
  connectedAccount: string;
  services: Service[];
  facilities?: string[];
  rates?: FeeRate[];
  note?: string;
  thirdpartyPrice: boolean;
  isActive: boolean;
  carrierRef: string;
  userRef: string;
}

export interface UserCarrier extends CreateUserCarrierData {
  id: Types.ObjectId;
  accountId: string;
}
