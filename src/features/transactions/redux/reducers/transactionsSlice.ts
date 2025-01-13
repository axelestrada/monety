import { createSlice } from "@reduxjs/toolkit";
import ITransaction from "@/features/transactions/types/transaction";

interface IInitialState {
  transactions: ITransaction[];
}

const initialState: IInitialState = {
  transactions: [],
};

const transactionsSlice = createSlice({
  name: "transactionsSlice",
  initialState,
  reducers: {
    updateTransactions: (
      state,
      action: {
        payload: ITransaction[];
        type: string;
      }
    ) => {
      state.transactions = action.payload;
    },
    addTransaction: (
      state,
      action: {
        payload: ITransaction;
        type: string;
      }
    ) => {
      state.transactions = [{ ...action.payload }, ...state.transactions];
    },
    deleteTransaction: (
      state,
      action: {
        payload: string;
        type: string;
      }
    ) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
  },
});

export const transactionServices = {
  actions: transactionsSlice.actions,
};

export const transactionsReducer = transactionsSlice.reducer;
