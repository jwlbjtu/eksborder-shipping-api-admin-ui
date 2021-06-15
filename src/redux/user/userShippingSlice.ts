import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { ShippingRecord } from '../../shared/types/record';
import {
  AppThunk,
  RootState,
  UserShippingState
} from '../../shared/types/redux-types';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: UserShippingState = {
  shippingRecords: [],
  shippingLoading: false
};

export const userShippingSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setShippingRecords: (state, action: PayloadAction<ShippingRecord[]>) => {
      state.shippingRecords = action.payload;
    },
    setShippingLoading: (state, action: PayloadAction<boolean>) => {
      state.shippingLoading = action.payload;
    }
  }
});

export const { setShippingLoading, setShippingRecords } =
  userShippingSlice.actions;

export const fetchUserShippingRecords =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setShippingLoading(true));
      axios
        .get(`${SERVER_ROUTES.RECORDS}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          dispatch(setShippingRecords(response.data));
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setShippingLoading(false)));
    }
  };

export const selectShippingRecords = (state: RootState): ShippingRecord[] =>
  state.shipments.shippingRecords;
export const selectShippingLoading = (state: RootState): boolean =>
  state.shipments.shippingLoading;

export default userShippingSlice.reducer;
