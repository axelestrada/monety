import { createSlice } from "@reduxjs/toolkit";
import { ITransaction } from "@/interfaces";

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
    updateTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions = [{ ...action.payload }, ...state.transactions];
    },
  },
});

export const transactionServices = {
  actions: transactionsSlice.actions,
};

const transactionsReducer = transactionsSlice.reducer;

export default transactionsReducer;