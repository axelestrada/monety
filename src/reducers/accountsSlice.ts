import { createSlice } from "@reduxjs/toolkit";
import { IAccount } from "@/interfaces";

interface IInitialState {
  accounts: IAccount[];
}

const initialState: IInitialState = {
  accounts: [],
};

const accountsSlice = createSlice({
  name: "accountsSlice",
  initialState,
  reducers: {
    updateAccounts: (state, action) => {
      state.accounts = action.payload;
    },
  },
});

export const accountsServices = {
  actions: accountsSlice.actions,
};

const accountsReducer = accountsSlice.reducer;

export default accountsReducer;
