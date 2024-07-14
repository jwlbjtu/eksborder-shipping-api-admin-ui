import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import {
  ThirdPartyAccount,
  ThirdPartyAccountData
} from '../../shared/types/carrier';
import {
  AppThunk,
  ThirdPartyState,
  RootState
} from '../../shared/types/redux-types';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: ThirdPartyState = {
  accounts: [],
  loading: false,
  showModal: false,
  modalLoading: false,
  priceModalShow: false,
  priceTabelModalShow: false,
  zoneModal: false,
  zoneUploadModal: false
};

export const thirdpartySlice = createSlice({
  name: 'thirdpartyAccounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<ThirdPartyAccount[]>) => {
      state.accounts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setModalLoading: (state, action: PayloadAction<boolean>) => {
      state.modalLoading = action.payload;
    },
    setPriceModalShow: (state, action: PayloadAction<boolean>) => {
      state.priceModalShow = action.payload;
    },
    setPriceTableModalShow: (state, action: PayloadAction<boolean>) => {
      state.priceTabelModalShow = action.payload;
    },
    setZoneModalShow: (state, action: PayloadAction<boolean>) => {
      state.zoneModal = action.payload;
    },
    setZoneUploadModalShow: (state, action: PayloadAction<boolean>) => {
      state.zoneUploadModal = action.payload;
    }
  }
});

export const {
  setAccounts,
  setLoading,
  setShowModal,
  setModalLoading,
  setPriceModalShow,
  setPriceTableModalShow,
  setZoneModalShow,
  setZoneUploadModalShow
} = thirdpartySlice.actions;

export const fetchThirdPartyAccounts =
  (carrierId: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .get(`${SERVER_ROUTES.THIRDPARTY_ACCOUNTS}/${carrierId}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          const accounts = response.data;
          dispatch(setAccounts(accounts));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const createThridPartyAccountHandler =
  (data: ThirdPartyAccountData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setModalLoading(true));
      axios
        .post(`${SERVER_ROUTES.THIRDPARTY_ACCOUNTS}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
          dispatch(fetchThirdPartyAccounts(data.carrierRef));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
        });
    }
  };

export const updateThirdPartyAccountHandler =
  (data: ThirdPartyAccount): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setModalLoading(true));
      axios
        .put(`${SERVER_ROUTES.THIRDPARTY_ACCOUNTS}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
          dispatch(fetchThirdPartyAccounts(data.carrierRef));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
        });
    }
  };

export const deleteThirdPartyAccountHandler =
  (data: ThirdPartyAccount): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .delete(`${SERVER_ROUTES.THIRDPARTY_ACCOUNTS}/${data.id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchThirdPartyAccounts(data.carrierRef));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const selectAccounts = (state: RootState): ThirdPartyAccount[] =>
  state.thirdpartyAccounts.accounts;
export const selectThirdpartyLoading = (state: RootState): boolean =>
  state.thirdpartyAccounts.loading;
export const selectThirdpartyShowModal = (state: RootState): boolean =>
  state.thirdpartyAccounts.showModal;
export const selectThirdpartyModalLoading = (state: RootState): boolean =>
  state.thirdpartyAccounts.modalLoading;
export const selectThirdpartyPriceModal = (state: RootState): boolean =>
  state.thirdpartyAccounts.priceModalShow;
export const selectThirdpartyPriceTableModal = (state: RootState): boolean =>
  state.thirdpartyAccounts.priceTabelModalShow;
export const selectZoneModal = (state: RootState): boolean =>
  state.thirdpartyAccounts.zoneModal;
export const selectZoneUploadModal = (state: RootState): boolean =>
  state.thirdpartyAccounts.zoneUploadModal;

export default thirdpartySlice.reducer;
