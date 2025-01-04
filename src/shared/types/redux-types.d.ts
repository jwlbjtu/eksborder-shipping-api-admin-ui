import { Billing } from './billing';
import { Carrier, CustomService, PriceTable } from './carrier';
import { ShippingRecord } from './record';
import { User, UserData } from './user';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown, 
  Action<string>
>;

export interface RootState {
  currentUser: CurrentUserState;
  users: UsersState;
  userCarriers: UserCarrierState;
  shipments: UserShippingState;
  billing: UserBillingState;
  carriers: CarriersState;
  thirdpartyAccounts: ThirdPartyState;
  priceTabels: PriceTableState;
  customServiceTable: CustomServiceTableState;
  accounting: AccountingState;
  batch: BatchState;
  rate: RateCheckState;
}

export interface CurrentUserState {
  curUser: UserData | undefined;
  userLoading: boolean;
  loginLoading: boolean;
  loginError: boolean;
  userTimeout: NodeJS.Timeout | undefined;
}

export interface CarriersState {
  carriers: Carrier[];
  carrisersLoading: boolean;
  showCarrierList: boolean;
  redirectToCarriers: boolean;
}

export interface UsersState {
  adminUsers: User[];
  clientUsers: User[];
  loading: boolean;
  showCreateAdmin: boolean;
  showCreateClient: boolean;
}

export interface BatchState {
  batchLoading : boolean;
  batchShippingRecords : ShippingRecord[]
}

export interface UserShippingState {
  shippingRecords: ShippingRecord[];
  shippingLoading: boolean;
}

export interface UserCarrierState {
  carrierRecords: UserCarrier[];
  carrierLoading: boolean;
  showCreateCarrier: boolean;
  showUpdateCarrier: boolean;
}

export interface UserBillingState {
  billings: Billing[];
  billingLoading: boolean;
  showBillingForm: boolean;
}

export interface ThirdPartyState {
  accounts: ThirdPartyAccount[];
  loading: boolean;
  showModal: boolean;
  modalLoading: boolean;
  priceModalShow: boolean;
  priceTabelModalShow: boolean;
  zoneModal: boolean;
  zoneUploadModal: boolean;
}

export interface PriceTableState {
  accounts: PriceTable[];
  loading: boolean;
  showModal: boolean;
  modalLoading: boolean;
  priceModalShow: boolean;
  priceTabelModalShow: boolean;
  zoneModal: boolean;
}

export interface CustomServiceTableState {
  customServices: CustomService[];
  loading: boolean;
  showModal: boolean;
  modalLoading: boolean;
}

export interface UserShippingRecordsSearchQuery {
  startDate: string;
  endDate: string;
  orderId?: string;
  name?: string;
  phone?: string;
  trackingId?: string;
  zip?: string;
  status: string;
}

export interface UserBillingRecordsSearchQuery {
  startDate: string;
  endDate: string;
  status?: string;
  orderId?: string;
  channel?: string;
}

export interface AccountingItem {
  id: string;
  weight: number;
  weightType: string;
  uspsState: string;
  pieceId: string;
  orderDate: string;
  date: Date;
  orderId: string;
  channel: string;
  amount: number; // total amount (应收账款)
  baseAmount: number; // base amount
  servicePayment: number; // service payment (应付账款)
  status: number; // 0: success, 1: failed
  trackingNumber: string;
  recordRef: string;
  userRef?: string;
  userName?: string;
  remark?: string;
  zone?: string;
  docName?: string;
}

export interface ReconciliationRecord {
  id: string;
  date: Date;
  name: string;
  status: number; // 0: pending, 1: finished
  sucessCount: number;
  failedCount: number;
}

export interface AccountingState {
  loading: boolean;
  showReconciliationModal: boolean;
  reconciliationRecords: ReconciliationRecord[];
  accountingItems: AccountingItem[];
}

export interface AccountingItemSearchQuery {
  userName?: string;
  orderId?: string;
  trackingNumber?: string;
  status?: number;
  docName?: string;
}

export interface RateCheckState {
  loading: boolean;
  rates: RateInfo;
}

export interface RateInfo {
  rate: number;
  currency: string;
  fee: number;
  baseRate: number;
  details?: any;
}

export interface UserShippingRateRequest {
  channel: string;
  toAddress: OrderAddress;
  packageList: ApiPackage[];
}

export interface ApiPackage {
  weight: number; // 重量 KG
  length?: number; // 长 cm
  width?: number; // 宽 cm
  height?: number; // 高 cm
  count: number; // 件数
  lineItems: ApiLineItem[];
}