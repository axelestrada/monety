import { useCallback, useEffect, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";
import { ITransaction } from "@/interfaces";
import { useAppDispatch, useTypedSelector } from "@/store";

import { transactionServices } from "@/reducers/transactionsSlice";
import moment from "moment";

export default function useTransactions() {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const { transactions } = useTypedSelector((state) => state.transactions);
  const dispatch = useAppDispatch();

  const db = useSQLiteContext();

  const loadTransactions = useCallback(async () => {
    try {
      const result = await db.getAllAsync<ITransaction[]>(
        `
        SELECT Transactions.id, Transactions.created_at as createdAt, Transactions.comment, Transactions.date, Transactions.amount,
          Transactions.type, Categories.color AS categoryColor, Categories.icon AS categoryIcon,
          Categories.name AS categoryName, Accounts.name as accountName
        FROM Transactions
        INNER JOIN Categories ON Categories.id = Transactions.category_id
        INNER JOIN Accounts ON Accounts.id = Transactions.account_id
        WHERE Transactions.created_at >= ? AND Transactions.created_at <= ?
        ORDER BY Transactions.date DESC;
      `,
        [timeRange.from, timeRange.to]
      );

      dispatch(transactionServices.actions.updateTransactions(result));
    } catch (error) {
      console.error(error);
    }
  }, [timeRange]);

  useEffect(() => {
    loadTransactions();
  }, [timeRange]);

  return { loadTransactions, transactions };
}
