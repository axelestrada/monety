import { useCallback, useEffect } from "react";

import { useSQLiteContext } from "expo-sqlite";
import { IAccount } from "@/interfaces";
import { useAppDispatch, useTypedSelector } from "@/store";

import { accountsServices } from "@/reducers/accountsSlice";

export default function useAccounts() {
  const { accounts } = useTypedSelector((state) => state.accounts);
  const dispatch = useAppDispatch();

  const db = useSQLiteContext();

  const loadAccounts = useCallback(async () => {
    try {
      const result = await db.getAllAsync<IAccount>(
        `
      SELECT * FROM Accounts;
      `
      );

      dispatch(
        accountsServices.actions.updateAccounts([
          ...result,
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Regular",
            currentBalance: 0,
          },
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Savings",
            currentBalance: 0,
          },
        ])
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, []);

  return { loadAccounts, accounts };
}
