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
import { Link, SplashScreen, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import BottomTabNavigator from "@/components/BottomTabNavigator";
import OverallBalance from "@/components/OverallBalance";
import CashFlowItem from "@/components/CashFlowItem";
import TransactionsList from "@/components/TransactionsList";
import IconButton from "@/components/ui/IconButton";
import { Feather, Octicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

import { LineChart, lineDataItem } from "react-native-gifted-charts";
import uuid from "react-native-uuid";
import { defaultCategories } from "@/constants/categories";
import { useAccounts, useCategories, useTransactions } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import TimeRange from "@/components/TimeRange";
import moment, { max } from "moment";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  LongPressGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { transactionServices } from "@/reducers/transactionsSlice";
import NoTransactions from "@/components/NoTransactions";
import Transaction from "@/components/Transaction";
import SeeAllButton from "@/components/ui/SeeAllButton";
import { ITransaction } from "@/interfaces";

import { Alert } from "react-native";
import * as Updates from "expo-updates";
import calculateOffset from "@/utils/calculateOffset";
import getYAxisLabelTexts from "@/utils/getYAxisLabelTexts";
import calculateStepValue from "@/utils/calculateStepValue";
import Header from "@/components/Header/Header";
import calculateMaxValue from "@/utils/calculateMaxValue";

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const db = useSQLiteContext();
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const dispatch = useAppDispatch();

  const { loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { loadCategories } = useCategories();

  const { transactions }: { transactions: ITransaction[] } = useTypedSelector(
    (state) => state.transactions
  );
  const { categories } = useTypedSelector((state) => state.categories);

  const [refreshing, setRefreshing] = useState(false);

  const [incomes, setIncomes] = useState<lineDataItem[]>([
    { value: 0 },
    { value: 0 },
  ]);
  const [expenses, setExpenses] = useState<lineDataItem[]>([
    { value: 0 },
    { value: 0 },
  ]);

  const [maxValue, setMaxValue] = useState(100);
  const [minValue, setMinValue] = useState(0);
  const [breakpoints, setBreakpoints] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<number>(0);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const router = useRouter();

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
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Nueva actualización",
            "Hay una nueva versión disponible. ¿Quieres actualizar?",
            [
              { text: "No", style: "cancel" },
              {
                text: "Sí",
                onPress: () =>
                  Updates.fetchUpdateAsync().then(() => Updates.reloadAsync()),
              },
            ]
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    checkForUpdates();

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

      async function createIndexes() {
        const indexQueries = [
          `CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON Transactions (created_at);`,
          `CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON Transactions (category_id);`,
          `CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON Transactions (account_id);`,
          `CREATE INDEX IF NOT EXISTS idx_transactions_destination_account ON Transactions (destination_account);`,
        ];

        try {
          for (const query of indexQueries) {
            await db.execAsync(query);
          }
          console.log("Indexes created successfully.");
        } catch (error) {
          console.error("Error creating indexes:", error);
          throw error;
        }
      }

      createIndexes();

      loadAccounts();
      loadTransactions();
      loadCategories();
    }
  }, []);

  useEffect(() => {
    if (timeRange.interval === "all time" || timeRange.interval === "custom")
      return;

    const startDate = moment(
      Math.min(
        ...transactions
          .filter((tr) => tr.type !== "Transfer")
          .map((tr) => tr.date * 1000)
      )
    ).startOf(timeRange.interval === "day" ? "hour" : "day");

    setStartDate(startDate.unix());

    const endDate = moment(
      Math.max(
        ...transactions
          .filter((tr) => tr.type !== "Transfer")
          .map((tr) => tr.date * 1000)
      )
    ).endOf(timeRange.interval === "day" ? "hour" : "day");

    const newIncomes: lineDataItem[] = [];
    const newExpenses: lineDataItem[] = [];

    let newMaxValue: number = 0;

    const breakpoints: string[] = [];

    if (timeRange.interval !== "day") {
      const daysOfDifference = moment(endDate).diff(startDate, "days");

      for (let i = 0; i <= daysOfDifference; i++) {
        const currentDate = moment(startDate).add(i, "day");

        const incomesAmount = Math.round(
          transactions
            .filter((tr) => tr.type !== "Transfer")
            .filter((tr) => tr.type === "Income")
            .filter(
              (tr) =>
                tr.date >= moment(currentDate).startOf("day").unix() &&
                tr.date <= moment(currentDate).endOf("day").unix()
            )
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        const expensesAmount = Math.round(
          transactions
            .filter((tr) => tr.type !== "Transfer")
            .filter((tr) => tr.type === "Expense")
            .filter(
              (tr) =>
                tr.date >= moment(currentDate).startOf("day").unix() &&
                tr.date <= moment(currentDate).endOf("day").unix()
            )
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        newMaxValue = incomesAmount > newMaxValue ? incomesAmount : newMaxValue;

        newIncomes.push({
          value: incomesAmount,
        });

        newMaxValue =
          expensesAmount > newMaxValue ? expensesAmount : newMaxValue;

        newExpenses.push({
          value: expensesAmount,
        });
      }
    } else {
      const hoursOfDifference = moment(endDate).diff(startDate, "hours");

      for (let i = 0; i <= hoursOfDifference; i++) {
        const currentDate = moment(startDate).add(i, "hour");

        const incomesAmount = Math.round(
          transactions
            .filter((tr) => tr.type !== "Transfer")
            .filter((tr) => tr.type === "Income")
            .filter(
              (tr) =>
                tr.date >= moment(currentDate).startOf("hour").unix() &&
                tr.date <= moment(currentDate).endOf("hour").unix()
            )
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        const expensesAmount = Math.round(
          transactions
            .filter((tr) => tr.type !== "Transfer")
            .filter((tr) => tr.type === "Expense")
            .filter(
              (tr) =>
                tr.date >= moment(currentDate).startOf("hour").unix() &&
                tr.date <= moment(currentDate).endOf("hour").unix()
            )
            .reduce((acc, curr) => acc + curr.amount, 0)
        );

        newMaxValue = incomesAmount > newMaxValue ? incomesAmount : newMaxValue;

        newIncomes.push({
          value: incomesAmount,
        });

        newMaxValue =
          expensesAmount > newMaxValue ? expensesAmount : newMaxValue;

        newExpenses.push({
          value: expensesAmount,
        });

        breakpoints.push(moment(currentDate).startOf("hour").format("hh:mm"));
      }
    }

    setBreakpoints(breakpoints);

    if (newIncomes.length === 0 && newExpenses.length === 0) {
      setIncomes([{ value: 0 }, { value: 0 }]);
      setExpenses([{ value: 0 }, { value: 0 }]);
      setMaxValue(100);
      setMinValue(0);
      return;
    } else {
      if (newIncomes.length === 0) {
        newIncomes.push({ value: 0 }, { value: 0 });
      } else {
        if (newIncomes.length === 1) {
          newIncomes.push({ value: 0 });
        }
      }

      if (newExpenses.length === 0) {
        newExpenses.push({ value: 0 }, { value: 0 });
      } else {
        if (newExpenses.length === 1) {
          newExpenses.push({ value: 0 });
        }
      }

      setIncomes(newIncomes);
      setExpenses(newExpenses);

      const max = Math.max(
        ...[...newIncomes, ...newExpenses].map((item) => item.value)
      );

      const min = Math.min(
        ...[...newIncomes, ...newExpenses].map((item) => item.value)
      );

      setMaxValue(max);
      setMinValue(min);
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

  const spacing = (data: lineDataItem[]) => {
    if (data.length === 0) return 0;

    if ((screenWidth - 88) / (data.length - 1) < 48) return 48;

    return (screenWidth - 88) / (data.length - 1);
  };

  const yAxisLabelTexts = getYAxisLabelTexts(
    minValue,
    calculateMaxValue(minValue, maxValue),
    3
  );

  const diff = maxValue - minValue;

  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  moment.locale("en");

  //#endregion

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className="flex flex-1 bg-light-background dark:bg-[#0D0D0D]"
        onLayout={onLayoutRootView}
      >
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={colorScheme === "light" ? "#FFFFFF" : "#0D0D0D"}
        />

        <Header overallBalance dateRange />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={scrollEnabled}
          onTouchEnd={() => {
            setScrollEnabled(true);
          }}
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
          <TouchableWithoutFeedback
            onLongPress={() => setScrollEnabled(false)}
            delayLongPress={200}
          >
            <View className="bg-white dark:bg-[#1A1A1A] rounded-2xl pt-2 mt-4 dark:mt-2 mx-3 shadow-md shadow-main-25">
              <View className="mx-3 flex-row justify-between items-center">
                <Text className="text-main dark:text-[#F5F5F5] text-lg font-[Rounded-Bold]">
                  Statistics
                </Text>

                <View className="flex-row items-center justify-center">
                  <View className="flex-row items-center justify-center mr-2.5">
                    <View className="bg-green dark:bg-[#5bbe77] w-2 h-2 mr-1 rounded-full"></View>
                    <Text className="text-main dark:text-[#f5f5f5] font-[Rounded-Medium]">
                      Incomes
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-red dark:bg-[#ff8092] w-2 h-2 mr-1 rounded-full"></View>
                    <Text className="text-main dark:text-[#f5f5f5] font-[Rounded-Medium]">
                      Expenses
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-3">
                <LineChart
                  data={incomes}
                  data2={expenses}
                  overflowTop={100}
                  isAnimated={false}
                  height={150}
                  width={spacing(incomes) > 48 ? screenWidth - 69 : undefined}
                  pointerConfig={{
                    activatePointersOnLongPress: true,
                    pointer1Color:
                      colorScheme === "dark" ? "#5bbe77" : "#02AB5B",
                    pointer2Color:
                      colorScheme === "dark" ? "#FF8092" : "#FF8092",
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelHeight: 45,
                    activatePointersDelay: 200,
                    radius: 5,
                    pointerVanishDelay: 0,
                    pointerLabelComponent: (
                      items: any,
                      si: any,
                      idx: number
                    ) => {
                      return idx >= 0 ? (
                        <View
                          style={[
                            {
                              width: 80,
                              height: 40,
                              backgroundColor:
                                colorScheme === "light" ? "#FFFFFF" : "#383838",
                              borderRadius: 8,
                              paddingVertical: 4,
                              elevation: colorScheme === "dark" ? 0 : 8,
                              shadowColor: "#1B1D1C80",
                              alignItems: "center",
                              justifyContent: "space-between",
                              left:
                                idx === 0
                                  ? 5
                                  : idx === incomes.length - 1
                                  ? spacing(incomes) > 48
                                    ? 0
                                    : -48
                                  : idx === incomes.length - 2
                                  ? spacing(incomes) < 96
                                    ? -48
                                    : 48
                                  : 48,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color:
                                colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C",
                              fontFamily: "Rounded-Medium",
                              fontSize: 12,
                            }}
                          >
                            {timeRange.interval === "day"
                              ? moment(startDate * 1000)
                                  .add(idx, "hour")
                                  .format("hh:mm A")
                              : moment(startDate * 1000)
                                  .add(idx, "day")
                                  .format("MMM DD")}
                          </Text>
                          <View className="flex-row items-center justify-center flex-[1] w-full px-1">
                            <Text
                              className="pr-1"
                              style={{
                                color:
                                  colorScheme === "dark"
                                    ? "#5bbe77"
                                    : "#02AB5B",
                                fontFamily: "Rounded-Medium",
                                fontSize: 12,
                              }}
                            >
                              +L{items[0].value}
                            </Text>
                            <Text
                              style={{
                                color:
                                  colorScheme === "dark"
                                    ? "#FF8092"
                                    : "#FF8092",
                                fontFamily: "Rounded-Medium",
                                fontSize: 12,
                              }}
                            >
                              -L{items[1].value}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <></>
                      );
                    },
                    pointerLabelWidth: 80,
                    showPointerStrip: false,
                    resetPointerOnDataChange: false,
                    pointerEvents: "auto",
                  }}
                  hideRules
                  areaChart={colorScheme === "light"}
                  color1={colorScheme === "dark" ? "#5bbe77" : "#02AB5B"}
                  color2={colorScheme === "dark" ? "#FF8092" : "#FF8092"}
                  startFillColor1="#02AB5B"
                  startFillColor2="#FF8092"
                  startOpacity={0.3}
                  endOpacity={0}
                  curved
                  curveType={1}
                  initialSpacing={7}
                  spacing={spacing(incomes)}
                  endSpacing={-(spacing(incomes) - 12)}
                  hideDataPoints
                  yAxisLabelTexts={yAxisLabelTexts}
                  stepHeight={150 / 3}
                  noOfSections={3}
                  maxValue={calculateMaxValue(minValue, maxValue)}
                  yAxisLabelWidth={45}
                  xAxisThickness={0}
                  yAxisThickness={0}
                  yAxisTextStyle={{
                    color: colorScheme === "dark" ? "#F5F5F580" : "#1B1D1C80",
                    fontFamily: "Rounded-Regular",
                    fontSize: 12,
                  }}
                  yAxisLabelContainerStyle={{
                    paddingLeft: spacing(incomes) > 48 ? 9 : 2,
                    paddingRight: 2,
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View className="flex flex-row mt-3 mx-1.5">
            <CashFlowItem
              type="Incomes"
              active
              value={transactions
                .filter((transaction) => transaction.type === "Income")
                .reduce((acc, curr) => acc + curr.amount, 0)}
              onPress={() =>
                router.navigate({
                  pathname: "/categories",
                  params: {
                    type: "Income",
                  },
                })
              }
            />
            <CashFlowItem
              type="Expenses"
              active
              value={transactions
                .filter((transaction) => transaction.type === "Expense")
                .reduce((acc, curr) => acc + curr.amount, 0)}
              onPress={() =>
                router.navigate({
                  pathname: "/categories",
                  params: {
                    type: "Expense",
                  },
                })
              }
            />
          </View>
          <View className="flex flex-row justify-between items-center mt-5 mb-2 mx-3">
            <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#F5F5F5]">
              Latest Transactions
            </Text>

            {transactions.length > 0 && <SeeAllButton />}
          </View>

          <View className="grow mb-2 dark:mb-0">
            {transactions.length > 0 ? (
              transactions
                .slice(0, 10)
                .map((transaction) => (
                  <Transaction key={transaction.id} transaction={transaction} />
                ))
            ) : (
              <NoTransactions />
            )}
          </View>
        </ScrollView>

        <BottomTabNavigator />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
