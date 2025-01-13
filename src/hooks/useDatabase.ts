import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { defaultAccounts } from "@/features/accounts/constants/defaultAccounts";
import { defaultCategories } from "@/features/categories/constants/defaultCategories";

import ITransaction from "@/features/transactions/types/transaction";

const useDatabase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = useSQLiteContext();

  const insertTransaction = useCallback(async (transaction: ITransaction) => {
    setLoading(true);
    setError(null);

    try {
      await db.runAsync(
        "INSERT INTO Transactions (date, created_at, amount, comment, origin_id, destination_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [
          transaction.date,
          transaction.createdAt,
          transaction.amount,
          transaction.comment || null,
          transaction.originId,
          transaction.destinationId,
          transaction.type,
        ]
      );
    } catch (error) {
      console.error("Error inserting transaction: ", error);
    }

    setLoading(false);
  }, []);

  const initializeDatabase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Enable foreign keys and WAL mode
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
      `);

      // Check if 'Categories' table exists
      const categoriesTable = await db.getFirstAsync(
        "PRAGMA table_info(Categories);"
      );

      if (!categoriesTable) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            icon INTEGER NOT NULL,
            color INTEGER NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
          );
        `);

        for (const category of defaultCategories) {
          await db.runAsync(
            "INSERT INTO Categories (name, icon, color, type) VALUES (?, ?, ?, ?);",
            [category.name, category.icon, category.color, category.type]
          );
        }
      }

      // Check if 'Accounts' table exists
      const accountsTable = await db.getFirstAsync(
        "PRAGMA table_info(Accounts);"
      );

      if (!accountsTable) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Accounts (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            icon INTEGER NOT NULL,
            color INTEGER NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('regular', 'savings')),
            current_balance REAL NOT NULL,
            include_in_totals INTEGER NOT NULL CHECK (include_in_totals IN (0, 1)),
            goal REAL
          );
        `);

        for (const account of defaultAccounts) {
          await db.runAsync(
            "INSERT INTO Accounts (name, description, icon, color, type, current_balance, include_in_totals, goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [
              account.name,
              account.description || "",
              account.icon,
              account.color,
              account.type,
              account.currentBalance,
              account.includeInOverallBalance,
              account.goal || null,
            ]
          );
        }
      }

      // Create 'Transactions' table
      await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Transactions (
            id INTEGER PRIMARY KEY NOT NULL,
            date INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            amount REAL NOT NULL,
            comment TEXT,
            origin_id INTEGER NOT NULL,
            destination_id INTEGER NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('transfer', 'expense', 'income'))
          );`);

      setLoading(false);
    } catch (error) {
      setError("Error initializing database: " + error);
      setLoading(false);
    }
  }, []);

  return { error, loading, initializeDatabase, insertTransaction };
};

export default useDatabase;
