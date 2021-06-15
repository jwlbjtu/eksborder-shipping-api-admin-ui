import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  CurrentUserState,
  RootState
} from '../../shared/types/redux-types';
import {
  PasswordFormValue,
  UpdateUserResponse,
  UpdateUserSelf,
  UserData,
  UserLogin
} from '../../shared/types/user';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: CurrentUserState = {
  curUser: undefined,
  userLoading: false,
  loginLoading: false,
  loginError: false,
  userTimeout: undefined
};

export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurUser: (state, action: PayloadAction<UserData | undefined>) => {
      state.curUser = action.payload;
    },
    updateCurUser: (state, action: PayloadAction<UpdateUserResponse>) => {
      if (state.curUser) {
        state.curUser.firstName = action.payload.firstName;
        state.curUser.lastName = action.payload.lastName;
        state.curUser.email = action.payload.email;
        state.curUser.countryCode = action.payload.countryCode;
        state.curUser.phone = action.payload.phone;
        state.curUser.companyName = action.payload.companyName;
        state.curUser.logoImage = action.payload.logoImage;
      }
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.userLoading = action.payload;
    },
    setLoginLoading: (state, action: PayloadAction<boolean>) => {
      state.loginLoading = action.payload;
    },
    setLoginError: (state, action: PayloadAction<boolean>) => {
      state.loginError = action.payload;
    },
    setUserTimeout: (
      state,
      action: PayloadAction<NodeJS.Timeout | undefined>
    ) => {
      state.userTimeout = action.payload;
    }
  }
});

export const {
  setCurUser,
  updateCurUser,
  setUserLoading,
  setLoginError,
  setLoginLoading,
  setUserTimeout
} = userSlice.actions;

export const loginUserHandler =
  (info: UserLogin): AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setLoginLoading(true));
    axios
      .post(`${SERVER_ROUTES.USERS}/login`, {
        user: info
      })
      .then((response) => {
        const data = response.data;
        dispatch(setCurUser(data));
        const remaintingTime = data.tokenExpire - Date.now();
        const logoutTimer = setTimeout(() => {
          dispatch(setCurUser(undefined));
        }, remaintingTime);
        dispatch(setUserTimeout(logoutTimer));
      })
      .catch(() => {
        dispatch(setLoginError(true));
      })
      .finally(() => dispatch(setLoginLoading(false)));
  };

export const logoutUserHandler =
  (): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setCurUser(undefined));
    const timer = getState().currentUser.userTimeout;
    if (timer) clearTimeout(timer);
  };

export const updateProfileHandler =
  (id: string, data: UpdateUserSelf): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserLoading(true));
      axios
        .put(
          SERVER_ROUTES.USERS,
          { id, ...data },
          {
            headers: {
              Authorization: `${user.token_type} ${user.token}`
            }
          }
        )
        .then((response) => {
          const updatedUser = response.data;
          dispatch(updateCurUser(updatedUser));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setUserLoading(false)));
    }
  };

export const updateSelfPasswordHandler =
  (data: PasswordFormValue): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setUserLoading(true));
      axios
        .put(`${SERVER_ROUTES.USERS}/selfPassword`, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setUserLoading(false)));
    }
  };

export const selectCurUser = (state: RootState): UserData | undefined =>
  state.currentUser.curUser;
export const selectUserLoading = (state: RootState): boolean =>
  state.currentUser.userLoading;
export const selectLoginLoading = (state: RootState): boolean =>
  state.currentUser.loginLoading;
export const selectLoginerror = (state: RootState): boolean =>
  state.currentUser.loginError;

export default userSlice.reducer;
