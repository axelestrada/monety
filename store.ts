import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import { accountsReducer } from "@/features/accounts/redux/reducers/accountsSlice";
import { categoriesReducer } from "@/features/categories/redux/reducers/categoriesSlice";
import { transactionsReducer } from "@/features/transactions/redux/reducers/transactionsSlice";
import { userPreferencesReducer } from "@/reducers/userPreferencesSlice";

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
    userPreferences: userPreferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
