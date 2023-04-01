import { createSlice, Dispatch } from '@reduxjs/toolkit';
import {
  AppThunk,
  CustomServiceTableState,
  RootState
} from '../../shared/types/redux-types';
import errorHandler from '../../shared/utils/errorHandler';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import { CustomService, CustomServiceParams } from '../../shared/types/carrier';

const initialState: CustomServiceTableState = {
  customServices: [],
  loading: false,
  showModal: false,
  modalLoading: false
};

export const customServiceTableSlice = createSlice({
  name: 'customServiceTable',
  initialState,
  reducers: {
    setCustomServices: (state, action) => {
      state.customServices = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setModalLoading: (state, action) => {
      state.modalLoading = action.payload;
    }
  }
});

export const { setCustomServices, setLoading, setShowModal, setModalLoading } =
  customServiceTableSlice.actions;

export const fetchCustomServices =
  (carrierId: string): AppThunk =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const user = getState().currentUser.curUser;
      if (user) {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${SERVER_ROUTES.CUSTOM_SERVICE}/${carrierId}`,
          {
            headers: {
              Authorization: `${user.token_type} ${user.token}`
            }
          }
        );
        const services = res.data;
        console.log(services);
        dispatch(setCustomServices(services));
        dispatch(setLoading(false));
      }
    } catch (err) {
      errorHandler(err, dispatch);
    }
  };

export const createCustomService =
  (data: CustomServiceParams): AppThunk =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const user = getState().currentUser.curUser;
      if (user) {
        dispatch(setModalLoading(true));
        const res = await axios.post(`${SERVER_ROUTES.CUSTOM_SERVICE}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        });
        const service = res.data;
        dispatch(
          setCustomServices([
            ...getState().customServiceTable.customServices,
            service
          ])
        );
        dispatch(setShowModal(false));
        dispatch(setModalLoading(false));
      }
    } catch (err) {
      errorHandler(err, dispatch);
    }
  };

export const deleteCustomService =
  (id: string): AppThunk =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const user = getState().currentUser.curUser;
      if (user) {
        dispatch(setLoading(true));
        await axios.delete(`${SERVER_ROUTES.CUSTOM_SERVICE}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        });
        const services = getState().customServiceTable.customServices.filter(
          (service) => service._id !== id
        );
        dispatch(setCustomServices(services));
        dispatch(setLoading(false));
      }
    } catch (err) {
      errorHandler(err, dispatch);
      dispatch(setLoading(false));
    }
  };

export const updateCustomService =
  (data: CustomServiceParams): AppThunk =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const user = getState().currentUser.curUser;
      if (user) {
        dispatch(setModalLoading(true));
        const res = await axios.put(`${SERVER_ROUTES.CUSTOM_SERVICE}`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        });
        const newService = res.data;
        const services = getState().customServiceTable.customServices.map(
          (service) => {
            if (service._id === data._id) {
              return newService;
            }
            return service;
          }
        );
        dispatch(setCustomServices(services));
        dispatch(setShowModal(false));
        dispatch(setModalLoading(false));
      }
    } catch (err) {
      errorHandler(err, dispatch);
      dispatch(setModalLoading(false));
    }
  };

export const selectCustomServices = (state: RootState): CustomService[] =>
  state.customServiceTable.customServices;
export const selectTableLoading = (state: RootState): boolean =>
  state.customServiceTable.loading;
export const selectShowModal = (state: RootState): boolean =>
  state.customServiceTable.showModal;
export const selectModalLoading = (state: RootState): boolean =>
  state.customServiceTable.modalLoading;

export default customServiceTableSlice.reducer;
