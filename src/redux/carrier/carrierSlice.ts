import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Carrier, CarrierUpdateData } from '../../shared/types/carrier';
import {
  AppThunk,
  CarriersState,
  RootState
} from '../../shared/types/redux-types';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import axios from '../../shared/utils/axios-base';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: CarriersState = {
  carriers: [],
  carrisersLoading: false,
  showCarrierList: false,
  redirectToCarriers: false
};

export const carrierSlice = createSlice({
  name: 'carriers',
  initialState,
  reducers: {
    setCarriers: (state, action: PayloadAction<Carrier[]>) => {
      state.carriers = action.payload;
    },
    setCarrierLoading: (state, action: PayloadAction<boolean>) => {
      state.carrisersLoading = action.payload;
    },
    setShowCarrierList: (state, action: PayloadAction<boolean>) => {
      state.showCarrierList = action.payload;
    },
    setRedirectToCarriers: (state, action: PayloadAction<boolean>) => {
      state.redirectToCarriers = action.payload;
    }
  }
});

export const {
  setCarriers,
  setCarrierLoading,
  setShowCarrierList,
  setRedirectToCarriers
} = carrierSlice.actions;

export const fetchCarriersHandler =
  (): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setCarrierLoading(true));
      axios
        .get(SERVER_ROUTES.CARRIER, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          dispatch(setCarriers(response.data));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setCarrierLoading(false)));
    }
  };

export const createCarrierHandler =
  (data: CarrierUpdateData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      axios
        .post(SERVER_ROUTES.CARRIER, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchCarriersHandler()))
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setRedirectToCarriers(true)));
    }
  };

export const updateCarrierhandler =
  (data: Carrier): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setCarrierLoading(true));
      axios
        .put(SERVER_ROUTES.CARRIER, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchCarriersHandler()))
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setCarrierLoading(false)));
    }
  };

export const deleteCarrierHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setCarrierLoading(true));
      axios
        .delete(`${SERVER_ROUTES.CARRIER}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchCarriersHandler()))
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setCarrierLoading(false)));
    }
  };

export const selectCarriers = (state: RootState): Carrier[] =>
  state.carriers.carriers;
export const selectCarrierLoading = (state: RootState): boolean =>
  state.carriers.carrisersLoading;
export const selectShowCarrierList = (state: RootState): boolean =>
  state.carriers.showCarrierList;
export const selectRedirectToCarriersPage = (state: RootState): boolean =>
  state.carriers.redirectToCarriers;

export default carrierSlice.reducer;
