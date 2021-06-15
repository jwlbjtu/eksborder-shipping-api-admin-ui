import { Billing } from './billing';
import { Carrier } from './carrier';
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
}
