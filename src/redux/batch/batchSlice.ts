import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, BatchState, RootState } from "../../shared/types/redux-types";
import { ShippingRecord } from "../../shared/types/record";
import axios from '../../shared/utils/axios-base';
import { SERVER_ROUTES } from "../../shared/utils/constants";
import errorHandler from "../../shared/utils/errorHandler";

export interface BatchSearchQuery {
    trackingNumbers: string[];
}

const initialState: BatchState = {
    batchLoading : false,
    batchShippingRecords : []
}

export const batchSlice = createSlice({
    name: 'batch',
    initialState,
    reducers: {
        setBatchLoading: (state, action: PayloadAction<boolean>) => {
            state.batchLoading = action.payload;
        },
        setBatchShippingRecords: (state, action: PayloadAction<ShippingRecord[]>) => {
            state.batchShippingRecords = action.payload;
        }
    }
});

export const { setBatchLoading, setBatchShippingRecords } = batchSlice.actions;

export const searchBatchShippingRecords = (searchQuery: BatchSearchQuery): AppThunk => async (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setBatchLoading(true));
        axios.post(`${SERVER_ROUTES.RECORDS}/batch/search`, searchQuery, {
            headers: {
                Authorization: `${user.token_type} ${user.token}`
            }
        })
        .then((response) => {
            dispatch(setBatchShippingRecords(response.data));
        })
        .catch((error) => {
            console.log(error);
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setBatchLoading(false));
        }
        )
    }
}

export const batchCancelShippingRecords = (searchQeury: BatchSearchQuery, records: ShippingRecord[]): AppThunk => async (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setBatchLoading(true));
        axios.post(`${SERVER_ROUTES.RECORDS}/batch/cancel`, records, {
            headers: {
                Authorization: `${user.token_type} ${user.token}`
            }
        })
        .then(() => {
            dispatch(searchBatchShippingRecords(searchQeury));
        })
        .catch((error) => {
            console.log(error);
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setBatchLoading(false));
        })
    }
}

// export const batchCancelSingleShippingRecords = (searchQeury: BatchSearchQuery, record: ShippingRecord): AppThunk => async (dispatch: Dispatch, getState: () => RootState) => {
//     const user = getState().currentUser.curUser;
//     if (user) {
//         dispatch(setBatchLoading(true));
//         axios.post(`${SERVER_ROUTES.RECORDS}/batch/singleCancel`, [record], {
//             headers: {
//                 Authorization: `${user.token_type} ${user.token}`
//             }
//         })
//         .then(() => {
//             dispatch(searchBatchShippingRecords(searchQeury));
//         })
//         .catch((error) => {
//             console.log(error);
//             errorHandler(error, dispatch);
//         })
//         .finally(() => {
//             dispatch(setBatchLoading(false));
//         })
//     }
// }

export const batchRevertSingleShippingRecord = (searchQuery: BatchSearchQuery, record: ShippingRecord): AppThunk => async (dispatch: Dispatch, getState: () => RootState) => {
    const user = getState().currentUser.curUser;
    if (user) {
        dispatch(setBatchLoading(true));
        axios.post(`${SERVER_ROUTES.RECORDS}/batch/singleRevert`, [record], {
            headers: {
                Authorization: `${user.token_type} ${user.token}`
            }
        })
        .then(() => {
            dispatch(searchBatchShippingRecords(searchQuery));
        })
        .catch((error) => {
            console.log(error);
            errorHandler(error, dispatch);
        })
        .finally(() => {
            dispatch(setBatchLoading(false));
        })
    }
}

export const selectBatchShippingRecords = (state: RootState): ShippingRecord[] => state.batch.batchShippingRecords;
export const selectBatchLoading = (state: RootState): boolean => state.batch.batchLoading;

export default batchSlice.reducer;