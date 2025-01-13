import { createSlice } from "@reduxjs/toolkit";
import IAccount from "@/features/accounts/types/account";

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
    setAccounts: (
      state,
      action: {
        payload: IAccount[];
      }
    ) => {
      state.accounts = action.payload;
    },
  },
});

export const accountsServices = {
  actions: accountsSlice.actions,
};

export const accountsReducer = accountsSlice.reducer;
