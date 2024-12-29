import { useCallback, useEffect, useMemo, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";
import { ITransaction } from "@/interfaces";
import { useAppDispatch, useTypedSelector } from "@/store";

import { transactionServices } from "@/reducers/transactionsSlice";
import moment from "moment";
import { accountsServices } from "@/reducers/accountsSlice";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";

export default function useTransactions() {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const { transactions } = useTypedSelector((state) => state.transactions);
  const { accounts } = useTypedSelector((state) => state.accounts);

  const dispatch = useAppDispatch();

  const db = useSQLiteContext();

  const deleteTransaction = useCallback(
    async (tr: ITransaction) => {
      try {
        const { id, type, accountId, destinationAccountId, amount } = tr;

        console.log(tr);

        const accountBalance =
          accounts.find((account) => accountId === account.id)
            ?.currentBalance || 0;
        const destinationAccountBalance =
          accounts.find((account) => destinationAccountId === account.id)
            ?.currentBalance || 0;

        console.log("AB:", accountBalance);
        console.log("DAB", destinationAccountBalance);

        if (id && destinationAccountId) {
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
            accountBalance + amount,
            accountId
          );

          await db.runAsync(
            `
          UPDATE Accounts SET currentBalance = ? WHERE id = ?
        `,
            destinationAccountBalance - amount,
            destinationAccountId
          );

          dispatch(transactionServices.actions.deleteTransaction(id));

          dispatch(
            accountsServices.actions.incrementBalance({
              id: accountId,
              amount,
            })
          );

          dispatch(
            accountsServices.actions.decrementBalance({
              id: destinationAccountId,
              amount,
            })
          );
        }

        if (id && !destinationAccountId) {
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
            type === "Income"
              ? accountBalance - amount
              : accountBalance + amount,
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
      } catch (error) {
        console.error(error);
      }
    },
    [accounts]
  );

  const loadTransactions = useCallback(async () => {
    dispatch(userPreferencesServices.actions.setLoading(true));

    const query = `
      SELECT
        Transactions.id,
        Transactions.created_at AS createdAt,
        Transactions.comment,
        Transactions.date,
        Transactions.amount,
        Transactions.type,
        Categories.color AS categoryColor,
        Categories.icon AS categoryIcon,
        Categories.name AS categoryName,
        A1.name AS accountName,
        A1.id AS accountId,
        A2.name AS destinationAccountName,
        A2.color AS destinationAccountColor,
        A2.icon AS destinationAccountIcon,
        A2.id AS destinationAccountId
      FROM Transactions
      LEFT JOIN Categories ON Categories.id = Transactions.category_id
      LEFT JOIN Accounts AS A1 ON A1.id = Transactions.account_id
      LEFT JOIN Accounts AS A2 ON A2.id = Transactions.destination_account
      WHERE Transactions.created_at >= ? AND Transactions.created_at <= ?
      ORDER BY Transactions.date DESC;
    `;

    const params = [timeRange.from, timeRange.to];

    try {
      const result = await db.getAllAsync<ITransaction>(query, params);
      dispatch(transactionServices.actions.updateTransactions(result));
      dispatch(userPreferencesServices.actions.setLoading(false));
    } catch (error) {
      console.error("Error retrieving transactions:", error);
      throw error;
    }
  }, [timeRange]);

  return { loadTransactions, deleteTransaction, transactions };
}
