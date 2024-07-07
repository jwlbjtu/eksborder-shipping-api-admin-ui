import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  RootState,
  UsersState
} from '../../shared/types/redux-types';
import {
  CreateUserData,
  PasswordFormValue,
  User
} from '../../shared/types/user';
import { SERVER_ROUTES, USER_ROLES } from '../../shared/utils/constants';
import axios from '../../shared/utils/axios-base';
import errorHandler from '../../shared/utils/errorHandler';

const initialState: UsersState = {
  adminUsers: [],
  clientUsers: [],
  loading: false,
  showCreateAdmin: false,
  showCreateClient: false
};

export const userDataSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setAdminUsers: (state, action: PayloadAction<User[]>) => {
      state.adminUsers = action.payload;
    },
    setClientUsers: (state, action: PayloadAction<User[]>) => {
      state.clientUsers = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      if (newUser.role === USER_ROLES.API_USER) {
        const userIndex = state.clientUsers.findIndex(
          (ele) => ele.id === newUser.id
        );
        state.clientUsers[userIndex] = newUser;
      } else {
        const userIndex = state.adminUsers.findIndex(
          (ele) => ele.id === newUser.id
        );
        state.adminUsers[userIndex] = newUser;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowCreateAdmin: (state, action: PayloadAction<boolean>) => {
      state.showCreateAdmin = action.payload;
    },
    setShowCreateClient: (state, action: PayloadAction<boolean>) => {
      state.showCreateClient = action.payload;
    }
  }
});

export const {
  setAdminUsers,
  setClientUsers,
  updateUser,
  setLoading,
  setShowCreateAdmin,
  setShowCreateClient
} = userDataSlice.actions;

export const fetchUsersByRoleHandler =
  (role: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .get(`${SERVER_ROUTES.USERS}/list/${role}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          if (role === 'admins') {
            dispatch(setAdminUsers(response.data));
          } else {
            dispatch(setClientUsers(response.data));
          }
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const getUserByIdHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      axios
        .get(`${SERVER_ROUTES.USERS}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          const newUser = response.data;
          dispatch(updateUser(newUser));
        })
        .catch((error) => errorHandler(error, dispatch));
    }
  };

export const createUserHandler =
  (data: CreateUserData): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .post(SERVER_ROUTES.USERS, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          if (
            data.role === USER_ROLES.ADMIN ||
            data.role === USER_ROLES.ADMIN_SUPER
          ) {
            dispatch(fetchUsersByRoleHandler('admins'));
          } else {
            dispatch(fetchUsersByRoleHandler(data.role));
          }
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setShowCreateAdmin(false));
          dispatch(setShowCreateClient(false));
        });
    }
  };

export const updateUserHandler =
  (data: User): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .put(SERVER_ROUTES.USERS, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          if (
            data.role === USER_ROLES.ADMIN ||
            data.role === USER_ROLES.ADMIN_SUPER
          ) {
            dispatch(fetchUsersByRoleHandler('admins'));
          } else {
            dispatch(fetchUsersByRoleHandler(data.role));
          }
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => setLoading(false));
    }
  };

export const updateUserPasswordHandler =
  (id: string, values: PasswordFormValue): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .put(
          `${SERVER_ROUTES.USERS}/password`,
          {
            id,
            ...values
          },
          {
            headers: {
              Authorization: `${user.token_type} ${user.token}`
            }
          }
        )
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const deleteUserByIdHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      dispatch(setLoading(true));
      axios
        .delete(`${SERVER_ROUTES.USERS}/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => {
          dispatch(fetchUsersByRoleHandler('admins'));
          dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
        })
        .catch((error) => errorHandler(error, dispatch))
        .finally(() => dispatch(setLoading(false)));
    }
  };

export const createAPITokenHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      axios
        .get(`${SERVER_ROUTES.API}/refresh/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER)))
        .catch((error) => errorHandler(error, dispatch));
    }
  };

export const deleteAPITokenHandler =
  (id: string): AppThunk =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
      axios
        .get(`${SERVER_ROUTES.API}/revoke/${id}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then(() => dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER)))
        .catch((error) => errorHandler(error, dispatch));
    }
  };

export const selectAdminUsers = (state: RootState): User[] =>
  state.users.adminUsers;
export const selectClientUsers = (state: RootState): User[] =>
  state.users.clientUsers;
export const selectLoading = (state: RootState): boolean => state.users.loading;
export const selectShowCreateAdmin = (state: RootState): boolean =>
  state.users.showCreateAdmin;
export const selectShowCreateClient = (state: RootState): boolean =>
  state.users.showCreateClient;

export default userDataSlice.reducer;
