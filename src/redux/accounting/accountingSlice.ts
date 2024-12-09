import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { AccountingItem, AccountingItemSearchQuery, AccountingState, AppThunk, ReconciliationRecord, RootState } from '../../shared/types/redux-types';
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from "../../shared/utils/constants"; 
import errorHandler from "../../shared/utils/errorHandler"; 

const initialState: AccountingState = {
    loading: false,
    showReconciliationModal: false,
    reconciliationRecords: [],
    accountingItems: []
}

export const accountingSlice = createSlice({
    name: 'accounting',
    initialState,
    reducers:{
        setLoading:(state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setShowReconciliationModal:(state, action: PayloadAction<boolean>) => {
            state.showReconciliationModal = action.payload;
        },
        setReconciliationRecords:(state, action: PayloadAction<ReconciliationRecord[]>) => {
            state.reconciliationRecords = action.payload;
        },
        setAccountingItems:(state, action: PayloadAction<AccountingItem[]>) => {
            state.accountingItems = action.payload;
        }
    }
});

export const { setLoading, setShowReconciliationModal, setReconciliationRecords, setAccountingItems } = accountingSlice.actions;

export const fetchAccountingItems = (recordId: string): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setLoading(true));
        axios.get(`${SERVER_ROUTES.ACCOUNTING}/${recordId}`, {
            headers: {
                Authorization: `${user.token_type} ${user.token}`
            }
        })
        .then((response) => {
            const items: AccountingItem[] = response.data;
            dispatch(setAccountingItems(items));
        })
        .catch((error) => {
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setLoading(false));
        });
    }
}

export const searchAccountingItemsHandler = (recordId: string, searchQuery: AccountingItemSearchQuery): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setLoading(true));
        axios.post(`${SERVER_ROUTES.ACCOUNTING}/search/${recordId}`, searchQuery, {
            headers: {
                Authorization: `${user.token_type} ${user.token}`
            },
        })
        .then((response) => {
            const items: AccountingItem[] = response.data;
            dispatch(setAccountingItems(items));
        })
        .catch((error) => {
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setLoading(false));
        });
    }
}

export const fetchReconciliationRecords = (): AppThunk =>  (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setLoading(true)); 
        axios.get(`${SERVER_ROUTES.ACCOUNTING}`, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((resposne) => {
            const records: ReconciliationRecord[] = resposne.data;
            dispatch(setReconciliationRecords(records));
        })
        .catch((error) => {
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setLoading(false));
        });
    }
};

export const selectAccountingLoading = (state: RootState) => state.accounting.loading;
export const selectReconciliationRecords = (state: RootState) => state.accounting.reconciliationRecords;
export const selectShowReconciliationModal = (state: RootState) => state.accounting.showReconciliationModal;
export const selectAccountingItems = (state: RootState) => state.accounting.accountingItems;

export default accountingSlice.reducer;