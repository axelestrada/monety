import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import {accountsReducer, categoriesReducer, transactionsReducer} from "@/reducers/"

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
