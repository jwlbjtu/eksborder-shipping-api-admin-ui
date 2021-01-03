export interface UserLogin {
  email: string;
  password: string;
  isActive: boolean;
}

export interface UserData {
  userId: string;
  fullName: string;
  image: string;
  role: string;
  token_type: string;
  token: string;
}

export interface PasswordFormValue {
  password: string;
  'new-password': string;
}

export interface UpdateClientData {
  companyName: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
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
  services: string[];
  facilities: string[];
  fee: number;
  feeBase: string;
  billingType: string;
  carrierRef: string;
  userRef: string;
  note?: string;
  isActive: boolean;
}

export interface UserCarrier extends CreateUserCarrierData {
  id: Types.ObjectId;
  accountId: string;
}
