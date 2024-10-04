import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
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

import { LineChart } from "react-native-gifted-charts";

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

  const lineData = [
    { value: 0, dataPointText: "0" },
    { value: 10, dataPointText: "10" },
    { value: 8, dataPointText: "8" },
    { value: 58, dataPointText: "58" },
    { value: 56, dataPointText: "56" },
    { value: 78, dataPointText: "78" },
    { value: 74, dataPointText: "74" },
    { value: 98, dataPointText: "98" },
  ];

  const lineData2 = [
    { value: 15, dataPointText: "15" },
    { value: 20, dataPointText: "20" },
    { value: 18, dataPointText: "18" },
    { value: 40, dataPointText: "40" },
    { value: 36, dataPointText: "36" },
    { value: 60, dataPointText: "60" },
    { value: 54, dataPointText: "54" },
    { value: 85, dataPointText: "85" },
  ];

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

  const windowWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView
      className="flex flex-1 dark:bg-[#0D0D0D]"
      onLayout={onLayoutRootView}
    >
      {colorScheme === "light" && <BackgroundGradient />}

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Header title="Home">
        <IconButton onPress={toggleColorScheme}>
          <Octicons
            name="gear"
            size={18}
            color={colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"}
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
            colors={[colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"]}
            progressBackgroundColor={
              colorScheme === "dark" ? "#0d0d0d" : "#FFFFFF"
            }
          />
        }
      >
        <View className="bg-white dark:bg-[#1A1A1A] rounded-2xl pt-2 mx-3 overflow-hidden">
          <View className="mx-2 flex-row justify-between">
            <Text className="text-main dark:text-[#F5F5F5] text-lg font-[Rounded-Bold]">
              Statistics
            </Text>

            <View className="flex-row gap-[4]">
              <View className="flex-row items-center gap-[4]">
                <View className="bg-green dark:bg-[#5bbe77] w-2 h-2 rounded-full"></View>
                <Text className="text-main dark:text-[#f5f5f5] font-[Rounded-Medium]">
                  Incomes
                </Text>
              </View>

              <View className="flex-row items-center gap-[4]">
                <View className="bg-red dark:bg-[#ff8092] w-2 h-2 rounded-full"></View>
                <Text className="text-main dark:text-[#f5f5f5] font-[Rounded-Medium]">
                  Incomes
                </Text>
              </View>
            </View>
          </View>

          <View className="-mx-[10]">
            <LineChart
              isAnimated
              curved
              color1={colorScheme === "dark" ? "#5bbe77" : "#02AB5B"}
              color2={colorScheme === "dark" ? "#FF8092" : "#FF8092"}
              data={lineData}
              data2={lineData2}
              initialSpacing={0}
              endSpacing={0}
              hideDataPoints
              thickness={5}
              curvature={0.2}
              hideRules
              hideYAxisText
              hideOrigin
              yAxisThickness={0}
              xAxisThickness={0}
              adjustToWidth
              disableScroll
              width={windowWidth - 21}
            />
          </View>
        </View>

        {/* <AnalyticsChart type={analyticsType} /> */}

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
