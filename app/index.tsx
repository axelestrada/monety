import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { Link, SplashScreen } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import BackgroundGradient from "@/components/ui/BackgroundGradient";
import Header from "@/components/Header";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import OverallBalance from "@/components/OverallBalance";
import AnalyticsChart from "@/components/AnalyticsChart";
import CashFlowItem from "@/components/CashFlowItem";
import TransactionsList from "@/components/TransactionsList";
import IconButton from "@/components/ui/IconButton";
import { Octicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

import uuid from "react-native-uuid";
import { defaultCategories } from "@/constants/categories";
import { useAccounts, useTransactions } from "@/hooks";
import { useTypedSelector } from "@/store";

export default function Index() {
  const [analyticsType, setAnalyticsType] = useState<"Incomes" | "Expenses">(
    "Incomes"
  );

  const db = useSQLiteContext();
  const { loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();

  const { transactions } = useTypedSelector((state) => state.transactions);

  useEffect(() => {
    loadAccounts();
    loadTransactions();

    const initializeDatabase = async () => {
      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          PRAGMA foreign_keys = ON;
        `);
      } catch (error) {
        console.error(error);
      }

      const categoriesTable = await db.getAllAsync(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='Categories';
        `);

      if (categoriesTable.length === 0) {
        try {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Categories (
              id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              icon TEXT NOT NULL,
              color TEXT NOT NULL,
              type TEXT NOT NULL CHECK (type IN ('Expense', 'Income'))
          );`);

          defaultCategories.forEach(async ({ id, name, icon, color, type }) => {
            try {
              await db.runAsync(
                `
                INSERT INTO Categories (id, name, icon, color, type) VALUES (?, ?, ?, ?, ?);
              `,
                [id, name, icon, color, type]
              );
            } catch (error) {
              console.error();
            }
          });
        } catch (error) {
          console.error(error);
        }
      }

      const accountsTable = await db.getAllAsync(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='Accounts';
        `);

      if (accountsTable.length === 0) {
        try {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Accounts (
              id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              icon TEXT NOT NULL,
              color TEXT NOT NULL,
              type TEXT NOT NULL CHECK (type IN ('Regular', 'Savings')),
              currentBalance REAL NOT NULL
          );`);

          await db.runAsync(
            `
              INSERT INTO Accounts (id, name, icon, color, type, currentBalance) VALUES (?, ?, ?, ?, ?, ?);
              `,
            [
              uuid.v4().toString(),
              "Cash",
              "cash-outline",
              "00AD74",
              "Regular",
              0,
            ]
          );
        } catch (error) {
          console.error(error);
        }
      }

      try {
        // await db.execAsync(`DROP TABLE Transactions`);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Transactions (
            id TEXT PRIMARY KEY NOT NULL,
            category_id TEXT NOT NULL,
            account_id TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            date INTEGER NOT NULL,
            amount REAL NOT NULL,
            comment TEXT,
            type TEXT NOT NULL CHECK (type IN ('Income', 'Expense', 'Transfer')),
            FOREIGN KEY (category_id) REFERENCES Categories (id),
            FOREIGN KEY (account_id) REFERENCES Accounts (id)
        );`);
      } catch (error) {
        console.error(error);
      }
    };

    initializeDatabase();
  }, []);

  // #region Load Fonts
  const [fontsLoaded, fontError] = useFonts({
    "Rounded-Regular": require("../assets/fonts/Rounded-Regular.ttf"),
    "Rounded-Medium": require("../assets/fonts/Rounded-Medium.ttf"),
    "Rounded-Bold": require("../assets/fonts/Rounded-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  //#endregion

  return (
    <SafeAreaView className="flex flex-1" onLayout={onLayoutRootView}>
      <BackgroundGradient />

      <Header title="Home">
        <IconButton>
          <Octicons name="gear" size={18} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView
        className="mt-2 -mb-6"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <AnalyticsChart type={analyticsType} />

        <View className="flex flex-row mt-3 mx-1.5">
          <CashFlowItem
            type="Incomes"
            value={transactions
              .filter((transaction) => transaction.type === "Income")
              .reduce((acc, curr) => acc + curr.amount, 0)}
            onPress={() => setAnalyticsType("Incomes")}
          />
          <CashFlowItem
            type="Expenses"
            value={transactions
              .filter((transaction) => transaction.type === "Expense")
              .reduce((acc, curr) => acc + curr.amount, 0)}
            onPress={() => setAnalyticsType("Expenses")}
          />
        </View>

        <TransactionsList />
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
}
