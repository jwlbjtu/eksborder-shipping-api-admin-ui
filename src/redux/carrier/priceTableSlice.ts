import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { PriceTable, PriceTableData } from '../../shared/types/carrier';
import {
  AppThunk,
  PriceTableState,
  RootState
} from '../../shared/types/redux-types';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: PriceTableState = {
  accounts: [],
  loading: false,
  showModal: false,
  modalLoading: false,
  priceModalShow: false,
  priceTabelModalShow: false,
  zoneModal: false
};

export const priceTableSlice = createSlice({
  name: 'priceTables',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<PriceTable[]>) => {
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
  setZoneModalShow
} = priceTableSlice.actions;

export const fetchPriceTableAccounts =
  (carrierId: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .get(`${SERVER_ROUTES.PRICE_TABLES}/${carrierId}`, {
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

export const createPriceTableAccountHandler =
  (data: PriceTableData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setModalLoading(true));
      axios
        .post(`${SERVER_ROUTES.PRICE_TABLES}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
          dispatch(fetchPriceTableAccounts(data.carrierRef));
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

export const updatePriceTableAccountHandler =
  (data: PriceTable): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setModalLoading(true));
      axios
        .put(`${SERVER_ROUTES.PRICE_TABLES}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(setModalLoading(false));
          dispatch(setShowModal(false));
          dispatch(fetchPriceTableAccounts(data.carrierRef));
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

export const deletePriceTableAccountHandler =
  (data: PriceTable): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .delete(`${SERVER_ROUTES.PRICE_TABLES}/${data.id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchPriceTableAccounts(data.carrierRef));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const selectAccounts = (state: RootState): PriceTable[] =>
  state.priceTabels.accounts;
export const selectPriceTableLoading = (state: RootState): boolean =>
  state.priceTabels.loading;
export const selectPriceTableShowModal = (state: RootState): boolean =>
  state.priceTabels.showModal;
export const selectPriceTableModalLoading = (state: RootState): boolean =>
  state.priceTabels.modalLoading;
export const selectPriceTablePriceModal = (state: RootState): boolean =>
  state.priceTabels.priceModalShow;
export const selectPriceTablePriceTableModal = (state: RootState): boolean =>
  state.priceTabels.priceTabelModalShow;
export const selectZoneModal = (state: RootState): boolean =>
  state.priceTabels.zoneModal;

export default priceTableSlice.reducer;
