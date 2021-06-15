import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  RootState,
  UserCarrierState
} from '../../shared/types/redux-types';
import {
  CreateUserCarrierData,
  User,
  UserCarrier
} from '../../shared/types/user';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import axios from '../../shared/utils/axios-base';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: UserCarrierState = {
  carrierRecords: [],
  carrierLoading: false,
  showCreateCarrier: false,
  showUpdateCarrier: false
};

export const userCarrierSlice = createSlice({
  name: 'userCarriers',
  initialState,
  reducers: {
    setUserCarriers: (state, action: PayloadAction<User[]>) => {
      state.carrierRecords = action.payload;
    },
    setUserCarrierLoading: (state, action: PayloadAction<boolean>) => {
      state.carrierLoading = action.payload;
    },
    setShowUserCarrer: (state, action: PayloadAction<boolean>) => {
      state.showCreateCarrier = action.payload;
    },
    setShowUpdateUserCarrer: (state, action: PayloadAction<boolean>) => {
      state.showUpdateCarrier = action.payload;
    }
  }
});

export const {
  setUserCarriers,
  setUserCarrierLoading,
  setShowUserCarrer,
  setShowUpdateUserCarrer
} = userCarrierSlice.actions;

export const fetchUserCarriersHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserCarrierLoading(true));
      axios
        .get(`${SERVER_ROUTES.ACCOUNT}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          dispatch(setUserCarriers(response.data));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setUserCarrierLoading(false));
        });
    }
  };

export const createUserCarrierHandler =
  (id: string, account: CreateUserCarrierData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserCarrierLoading(true));
      axios
        .post(SERVER_ROUTES.ACCOUNT, account, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchUserCarriersHandler(id));
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => {
          dispatch(setUserCarrierLoading(false));
          dispatch(setShowUserCarrer(false));
        });
    }
  };

export const updateUserCarrierHandler =
  (
    id: string,
    updateData: { id: string; isActive: boolean } | UserCarrier
  ): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserCarrierLoading(true));
      axios
        .put(`${SERVER_ROUTES.ACCOUNT}`, updateData, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchUserCarriersHandler(id));
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => {
          dispatch(setShowUpdateUserCarrer(false));
          dispatch(setUserCarrierLoading(false));
        });
    }
  };

export const deleteUserCarrierHandler =
  (id: string, accountId: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserCarrierLoading(true));
      axios
        .delete(`${SERVER_ROUTES.ACCOUNT}/${accountId}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchUserCarriersHandler(id)))
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setUserCarrierLoading(false)));
    }
  };

export const selectUserCarreirs = (state: RootState): UserCarrier[] =>
  state.userCarriers.carrierRecords;
export const selectUserCarrierLoading = (state: RootState): boolean =>
  state.userCarriers.carrierLoading;
export const selectShowUserCarrier = (state: RootState): boolean =>
  state.userCarriers.showCreateCarrier;
export const selectShowUpdateUserCarrier = (state: RootState): boolean =>
  state.userCarriers.showUpdateCarrier;

export default userCarrierSlice.reducer;
