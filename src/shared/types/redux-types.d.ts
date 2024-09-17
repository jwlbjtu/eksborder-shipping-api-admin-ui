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