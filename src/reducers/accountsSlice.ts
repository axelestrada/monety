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
    addAccount: (
      state,
      action: {
        payload: IAccount;
      }
    ) => {
      state.accounts = [
        ...state.accounts.slice(0, -2),
        { ...action.payload },
        {
          id: "",
          name: "",
          icon: "accessibility-outline",
          color: "623387",
          type: "Regular",
          currentBalance: 0,
          includeInOverallBalance: 0,
        },
      ];
    },
    updateAccounts: (
      state,
      action: {
        payload: IAccount[];
      }
    ) => {
      state.accounts = action.payload;
    },
    updateAccount: (
      state,
      action: {
        payload: IAccount;
      }
    ) => {
      state.accounts = state.accounts.map((account) =>
        account.id === action.payload.id ? action.payload : account
      );
    },
    deleteAccount: (
      state,
      action: {
        payload: string;
      }
    ) => {
      state.accounts = state.accounts.filter(
        (account) => account.id !== action.payload
      );
    },
    incrementBalance: (
      state,
      action: {
        payload: { id: string; amount: number };
      }
    ) => {
      state.accounts = state.accounts.map((account) => {
        if (account.id === action.payload.id) {
          return {
            ...account,
            currentBalance: account.currentBalance + action.payload.amount,
          };
        }

        return account;
      });
    },
    decrementBalance: (
      state,
      action: {
        payload: { id: string; amount: number };
      }
    ) => {
      state.accounts = state.accounts.map((account) => {
        if (account.id === action.payload.id) {
          return {
            ...account,
            currentBalance: account.currentBalance - action.payload.amount,
          };
        }

        return account;
      });
    },
  },
});

export const accountsServices = {
  actions: accountsSlice.actions,
};

const accountsReducer = accountsSlice.reducer;

export default accountsReducer;
