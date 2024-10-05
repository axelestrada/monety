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

import { LineChart, lineDataItem } from "react-native-gifted-charts";

import uuid from "react-native-uuid";
import { defaultCategories } from "@/constants/categories";
import { useAccounts, useCategories, useTransactions } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import { ITransaction } from "@/interfaces";
import { transactionServices } from "@/reducers/transactionsSlice";
import TimeRange from "@/components/TimeRange";
import moment from "moment";

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

  const [incomes, setIncomes] = useState<lineDataItem[]>([{ value: 0 }]);
  const [expenses, setExpenses] = useState<lineDataItem[]>([{ value: 0 }]);

  const [maxValue, setMaxValue] = useState(100);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);

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

  useEffect(() => {
    const reversedTransactions = [...transactions].filter(
      (transaction) => transaction.type !== "Transfer"
    );

    if (reversedTransactions.length > 0) {
      const newIncomes: lineDataItem[] = [];
      const newExpenses: lineDataItem[] = [];

      let newMaxValue = 0;

      const minDate = moment(
        Math.min(
          ...reversedTransactions.map((transaction) => transaction.date * 1000)
        )
      )
        .startOf("hour")
        .unix();

      const maxDate = moment(
        Math.max(
          ...reversedTransactions.map((transaction) => transaction.date * 1000)
        )
      )
        .endOf("hour")
        .unix();

      const hoursOfDifference = moment(maxDate * 1000).diff(
        minDate * 1000,
        "hours"
      );

      let newBreakPoints: number[] = [0, 0, 0, 0, 0];

      if (hoursOfDifference <= 4) {
        newBreakPoints = newBreakPoints.map((val, idx) => {
          switch (idx) {
            case 0:
              return minDate;
            case 1:
              return moment(minDate * 1000)
                .add(1, "hour")
                .unix();
            case 2:
              return moment(minDate * 1000)
                .add(2, "hour")
                .unix();
            case 3:
              return moment(minDate * 1000)
                .add(3, "hour")
                .unix();
            case 4:
              return moment(minDate * 1000)
                .add(4, "hour")
                .unix();
            default:
              return 0;
          }
        });
      } else {
        const interval = Math.ceil(hoursOfDifference / 4);

        newBreakPoints = newBreakPoints.map((val, idx) => {
          switch (idx) {
            case 0:
              return minDate;
            case 1:
              return moment(minDate * 1000)
                .add(1 * interval, "hour")
                .unix();
            case 2:
              return moment(minDate * 1000)
                .add(2 * interval, "hour")
                .unix();
            case 3:
              return moment(minDate * 1000)
                .add(3 * interval, "hour")
                .unix();
            case 4:
              return moment(minDate * 1000)
                .add(4 * interval, "hour")
                .unix();
            default:
              return 0;
          }
        });
      }

      setBreakpoints(newBreakPoints);

      newBreakPoints.forEach((value, idx) => {
        const rangeTransactions = transactions.filter((transaction) => {
          return (
            transaction.date >= value &&
            transaction.date <=
              (idx === 4
                ? maxDate
                : moment((newBreakPoints[idx + 1] - 1) * 1000)
                    .endOf("hour")
                    .unix())
          );
        });

        const incomesAmount = Math.round(
          rangeTransactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        const expensesAmount = Math.round(
          rangeTransactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        const incomesLabelSize = (incomesAmount.toString().length + 1) * 14;

        newMaxValue = incomesAmount > newMaxValue ? incomesAmount : newMaxValue;

        newIncomes.push({
          value: incomesAmount,
          focusedDataPointLabelComponent: () => (
            <View
              className="dark:bg-[#5bbe77] bg-green rounded py-0.5 items-center"
              style={{
                width: incomesLabelSize,
                top:
                  incomesAmount === expensesAmount
                    ? 5
                    : incomesAmount > expensesAmount
                    ? 5
                    : 50,
                left: 22,
                transform: [{ translateX: -(incomesLabelSize / 2) }],
              }}
            >
              <Text className="font-[Rounded-Medium] text-white dark:text-[#F5F5F5]">
                L{incomesAmount}
              </Text>
            </View>
          ),
          focusedCustomDataPoint: () => (
            <View className="bg-green dark:bg-[#5bbe77] justify-center items-center w-[14] h-[14] -top-[4] rounded-full">
              <View className="bg-white dark:bg-[#F5F5F5] w-[8] h-[8] rounded-full"></View>
            </View>
          ),
        });

        const expensesLabelSize = (expensesAmount.toString().length + 1) * 14;

        newMaxValue =
          expensesAmount > newMaxValue ? expensesAmount : newMaxValue;

        newExpenses.push({
          value: expensesAmount,
          focusedDataPointLabelComponent: () => (
            <View
              className="bg-[#ff8092] py-0.5 top-1 rounded items-center"
              style={{
                width: expensesLabelSize,
                top:
                  expensesAmount === incomesAmount
                    ? 50
                    : expensesAmount > incomesAmount
                    ? 5
                    : 50,
                left: 22,
                transform: [{ translateX: -(expensesLabelSize / 2) }],
              }}
            >
              <Text className="font-[Rounded-Medium] text-white dark:text-[#F5F5F5]">
                L{expensesAmount}
              </Text>
            </View>
          ),
          focusedCustomDataPoint: () => (
            <View className="bg-[#ff8092] justify-center items-center w-[14] h-[14] -top-[4] rounded-full">
              <View className="dark:bg-[#F5F5F5] bg-white w-[8] h-[8] rounded-full"></View>
            </View>
          ),
        });
      });

      setMaxValue(newMaxValue);

      setIncomes([
        { value: newIncomes[0].value },
        ...newIncomes,
        { value: newIncomes[newIncomes.length - 1].value },
      ]);

      setExpenses([
        { value: newExpenses[0].value },
        ...newExpenses,
        { value: newExpenses[newExpenses.length - 1].value },
      ]);
    } else {
      setIncomes([{ value: 0 }, { value: 0 }]);
      setExpenses([{ value: 0 }, { value: 0 }]);
      setMaxValue(100);
      setBreakpoints([]);
    }
  }, [transactions]);

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

      <OverallBalance>
        <TimeRange />
      </OverallBalance>

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
        <View className="bg-white dark:bg-[#1A1A1A] rounded-2xl py-2 mx-3 overflow-hidden">
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

          <View className="-mx-[10] mt-4">
            <LineChart
              height={180}
              maxValue={maxValue + 32}
              overflowTop={100}
              overflowBottom={100}
              isAnimated
              curved
              color1={colorScheme === "dark" ? "#5bbe77" : "#02AB5B"}
              color2={colorScheme === "dark" ? "#FF8092" : "#FF8092"}
              data={incomes}
              data2={expenses}
              initialSpacing={0}
              dataPointLabelWidth={0}
              endSpacing={0}
              thickness={5}
              curvature={0.2}
              focusEnabled
              delayBeforeUnFocus={2000}
              customDataPoint={() => <></>}
              hideRules
              noOfSections={4}
              stepValue={maxValue / 4}
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{
                color: colorScheme === "dark" ? "#F5F5F580" : "#1B1D1C80",
                fontFamily: "Rounded-Regular",
                fontSize: 12,
              }}
              xAxisLabelsVerticalShift={20}
              adjustToWidth
              disableScroll
              width={windowWidth - 21}
            />
          </View>

          <View className="mx-[40] flex-row justify-between items-center">
            {breakpoints &&
              breakpoints.map((date, idx) => (
                <Text
                  key={date + idx}
                  className="text-main-500 dark:text-[#F5F5F580] font-[Rounded-Regular] text-xs"
                >
                  {moment(date * 1000).format("hh:mm A")}
                </Text>
              ))}
          </View>
        </View>

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
