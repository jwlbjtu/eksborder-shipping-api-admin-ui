export interface CreateBillingData {
  total: number;
  deposit: number;
  addFund?: boolean;
  description: string;
}

export interface Billing extends CreateBillingData {
  id: string;
  userRef: string;
  account?: string;
  balance: number;
  currency: string;
  details?: {
    shippingCost?: {
      amount: number;
      components?: {
        description: string;
        amount: number;
      }[];
    };
    fee?: {
      amount: number;
      type: string;
      base: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}
