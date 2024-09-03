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

export default function Index() {
  const [analyticsType, setAnalyticsType] = useState<"incomes" | "expenses">(
    "incomes"
  );

  const db = useSQLiteContext();

  useEffect(() => {
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
          <Octicons name="gear" size={20} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView
        className="mt-4 -mb-4"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <AnalyticsChart type={analyticsType} />

        <View className="flex flex-row mt-4 mx-2">
          <CashFlowItem
            type="incomes"
            value={1250}
            onPress={() => setAnalyticsType("incomes")}
          />
          <CashFlowItem
            type="expenses"
            value={570}
            onPress={() => setAnalyticsType("expenses")}
          />
        </View>

        <TransactionsList />
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
}
