import { useCallback, useEffect, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";
import { ITransaction } from "@/interfaces";
import { useAppDispatch, useTypedSelector } from "@/store";

import { transactionServices } from "@/reducers/transactionsSlice";
import moment from "moment";
import { accountsServices } from "@/reducers/accountsSlice";

export default function useTransactions() {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const { transactions } = useTypedSelector((state) => state.transactions);
  const { accounts } = useTypedSelector((state) => state.accounts);

  const dispatch = useAppDispatch();

  const db = useSQLiteContext();

  const deleteTransaction = useCallback(
    async ({ id, type, accountId, amount }: ITransaction) => {
      const accountBalance =
        accounts.find((account) => accountId === account.id)?.currentBalance ||
        0;

      if (id) {
        await db.runAsync(
          `
        DELETE FROM Transactions WHERE id = ?;
        `,
          id
        );

        await db.runAsync(
          `
        UPDATE Accounts SET currentBalance = ? WHERE id = ?
      `,
          type === "Income" ? accountBalance - amount : accountBalance + amount,
          accountId
        );

        dispatch(transactionServices.actions.deleteTransaction(id));

        if (type === "Expense") {
          dispatch(
            accountsServices.actions.incrementBalance({
              id: accountId,
              amount,
            })
          );
        } else if (type === "Income") {
          dispatch(
            accountsServices.actions.decrementBalance({
              id: accountId,
              amount,
            })
          );
        }
      }
    },
    []
  );

  const loadTransactions = useCallback(async () => {
    try {
      const result = await db.getAllAsync<ITransaction[]>(
        `
        SELECT Transactions.id, Transactions.created_at as createdAt, Transactions.comment, Transactions.date, Transactions.amount,
          Transactions.type, Categories.color AS categoryColor, Categories.icon AS categoryIcon,
          Categories.name AS categoryName, A1.name as accountName, A1.id as accountId,
          A2.name as categoryName, A2.color as categoryColor,
          A2.icon as categoryIcon
        FROM Transactions
        LEFT JOIN Categories ON Categories.id = Transactions.category_id
        LEFT JOIN Accounts AS A1 ON A1.id = Transactions.account_id
        LEFT JOIN Accounts AS A2 ON A2.id = Transactions.destination_account
        WHERE Transactions.created_at >= ? AND Transactions.created_at <= ?
        ORDER BY Transactions.date DESC;
      `,
        [timeRange.from, timeRange.to]
      );

      const s = await db.getAllAsync("SELECT * FROM Transactions");

      console.log(s);

      console.log(result);

      dispatch(transactionServices.actions.updateTransactions(result));
    } catch (error) {
      console.error(error);
    }
  }, [timeRange]);

  useEffect(() => {
    loadTransactions();
  }, [timeRange]);

  return { loadTransactions, deleteTransaction, transactions };
}
