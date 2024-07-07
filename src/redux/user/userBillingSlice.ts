import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  RootState,
  UserBillingState
} from '../../shared/types/redux-types';
import { SERVER_ROUTES, USER_ROLES } from '../../shared/utils/constants';
import axios from '../../shared/utils/axios-base';
import errorHandler from '../../shared/utils/errorHandler';
import { Billing, CreateBillingData } from '../../shared/types/billing';
import { fetchUsersByRoleHandler, getUserByIdHandler } from './userDataSlice';

const initialState: UserBillingState = {
  billings: [],
  billingLoading: false,
  showBillingForm: false
};

export const userBillingSlice = createSlice({
  name: 'billings',
  initialState,
  reducers: {
    setUserBillings: (state, action: PayloadAction<Billing[]>) => {
      state.billings = action.payload;
    },
    setUserBillingLoading: (state, action: PayloadAction<boolean>) => {
      state.billingLoading = action.payload;
    },
    setShowBillingForm: (state, action: PayloadAction<boolean>) => {
      state.showBillingForm = action.payload;
    }
  }
});

export const { setUserBillings, setUserBillingLoading, setShowBillingForm } =
  userBillingSlice.actions;

export const fetchUserBillingHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserBillingLoading(true));
      axios
        .get(`${SERVER_ROUTES.BILLINGS}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          dispatch(setUserBillings(response.data));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setUserBillingLoading(false));
        });
    }
  };

export const createUserBillingHandler =
  (id: string, data: CreateBillingData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserBillingLoading(true));
      axios
        .post(`${SERVER_ROUTES.BILLINGS}/${id}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchUserBillingHandler(id));
          dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
          // dispatch(getUserByIdHandler(id));
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => {
          dispatch(setUserBillingLoading(false));
          dispatch(setShowBillingForm(false));
        });
    }
  };

export const selectUserBillings = (state: RootState): Billing[] =>
  state.billing.billings;
export const selectUserBillingsLoading = (state: RootState): boolean =>
  state.billing.billingLoading;
export const selectShowUserBilling = (state: RootState): boolean =>
  state.billing.showBillingForm;

export default userBillingSlice.reducer;
