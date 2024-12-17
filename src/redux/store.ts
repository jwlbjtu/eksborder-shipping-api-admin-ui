import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice';
import userDataReducer from './user/userDataSlice';
import userShippingReducer from './user/userShippingSlice';
import userCarrierReducer from './user/userCarrierSlice';
import userBillingReducer from './user/userBillingSlice';
import carrierReducer from './carrier/carrierSlice';
import thirdpartyReducer from './carrier/thirdpartySlice';
import priceTableReducer from './carrier/priceTableSlice';
import customServiceTableReducer from './carrier/costumServiceTableSlice';
import accountingReducer from './accounting/accountingSlice';
import batchReducer from './batch/batchSlice';

const rootReducer = combineReducers({
  currentUser: userReducer,
  users: userDataReducer,
  userCarriers: userCarrierReducer,
  shipments: userShippingReducer,
  billing: userBillingReducer,
  carriers: carrierReducer,
  thirdpartyAccounts: thirdpartyReducer,
  priceTabels: priceTableReducer,
  customServiceTable: customServiceTableReducer,
  accounting: accountingReducer,
  batch: batchReducer
});

const persistConfig = {
  key: 'elite-admin',
  storage,
  whitelist: ['currentUser', 'carriers']
};

const persisitReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ reducer: persisitReducer });

export const persistor = persistStore(store);
