import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { useFonts } from "expo-font";
import {  StatusBar} from "expo-status-bar";
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
import { useAccounts, useCategories, useTransactions } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import { ITransaction } from "@/interfaces";
import { transactionServices } from "@/reducers/transactionsSlice";

export default function Index() {
  const [analyticsType, setAnalyticsType] = useState<"Incomes" | "Expenses">(
    "Incomes"
  );

  const db = useSQLiteContext();
  const { timeRange } = useTypedSelector((state) => state.userPreferences);

  const { loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { loadCategories } = useCategories();

  const { transactions } = useTypedSelector((state) => state.transactions);
  const { categories } = useTypedSelector((state) => state.categories);

  const [refreshing, setRefreshing] = useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts();
    loadTransactions();
    loadCategories();
    setRefreshing(false);
  }, [
    setRefreshing,
    loadTransactions,
    loadAccounts,
    loadCategories,
    timeRange,
  ]);

  useEffect(() => {
    loadTransactions();
  }, [timeRange, loadTransactions]);

  useEffect(() => {
    if (categories.length === 0) {
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

            defaultCategories.forEach(
              async ({ id, name, icon, color, type }) => {
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
              }
            );
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
                currentBalance REAL NOT NULL,
                includeInOverallBalance INTEGER NOT NULL
            );`);

            await db.runAsync(
              `
                INSERT INTO Accounts (id, name, icon, color, type, currentBalance, includeInOverallBalance) VALUES (?, ?, ?, ?, ?, ?, ?);
                `,
              [
                uuid.v4().toString(),
                "Cash",
                "cash-outline",
                "00AD74",
                "Regular",
                0,
                1,
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
              category_id TEXT,
              account_id TEXT NOT NULL,
              destination_account TEXT,
              created_at INTEGER NOT NULL,
              date INTEGER NOT NULL,
              amount REAL NOT NULL,
              comment TEXT,
              type TEXT NOT NULL CHECK (type IN ('Income', 'Expense', 'Transfer')),
              FOREIGN KEY (category_id) REFERENCES Categories (id),
              FOREIGN KEY (account_id) REFERENCES Accounts (id),
              FOREIGN KEY (destination_account) REFERENCES Accounts (id)
          );`);
        } catch (error) {
          console.error(error);
        }
      };

      initializeDatabase();

      loadAccounts();
      loadTransactions();
      loadCategories();
    }
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
    <SafeAreaView
      className="flex flex-1 dark:bg-[#121212]"
      onLayout={onLayoutRootView}
    >
      {colorScheme === "light" && <BackgroundGradient />}

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>

      <Header title="Home">
        <IconButton onPress={toggleColorScheme}>
          <Octicons
            name="gear"
            size={18}
            color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
          />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView
        className="mt-2 -mb-6"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"]}
            progressBackgroundColor={colorScheme === "dark" ? "#1B1D1C" : "#FFFFFF"}
          />
        }
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
