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

import BackgroundGradient from "@/components/ui/BackgroundGradient";
import Header from "@/components/Header";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import OverallBalance from "@/components/OverallBalance";
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

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const db = useSQLiteContext();
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const dispatch = useAppDispatch();

  const { loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { loadCategories } = useCategories();

  const { transactions } = useTypedSelector((state) => state.transactions);
  const { categories } = useTypedSelector((state) => state.categories);

  const [refreshing, setRefreshing] = useState(false);

  const [incomes, setIncomes] = useState<lineDataItem[]>([{ value: 0 }]);
  const [expenses, setExpenses] = useState<lineDataItem[]>([{ value: 0 }]);

  const [maxValue, setMaxValue] = useState(100);
  const [minValue, setMinValue] = useState(0);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
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
    const startDate = moment(
      Math.min(
        ...transactions
          .filter((tr) => tr.type !== "Transfer")
          .map((tr) => tr.date * 1000)
      )
    ).startOf("hour");

    setStartDate(startDate.unix());

    const endDate = moment(
      Math.max(
        ...transactions
          .filter((tr) => tr.type !== "Transfer")
          .map((tr) => tr.date * 1000)
      )
    ).endOf("hour");

    const hoursOfDifference = moment(endDate).diff(startDate, "hours");

    const newIncomes: lineDataItem[] = [];
    const newExpenses: lineDataItem[] = [];

    let newMaxValue: number = 0;

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

      const incomesLabelSize = (incomesAmount.toString().length + 1) * 14;

      newMaxValue = incomesAmount > newMaxValue ? incomesAmount : newMaxValue;

      newIncomes.push({
        value: incomesAmount,
      });

      const expensesLabelSize = (expensesAmount.toString().length + 1) * 14;

      newMaxValue = expensesAmount > newMaxValue ? expensesAmount : newMaxValue;

      newExpenses.push({
        value: expensesAmount,
      });
    }

    if (newIncomes.length === 0 && newExpenses.length === 0) {
      setIncomes([]);
      setExpenses([]);
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

      let max = Math.max(
        ...[...newIncomes, ...newExpenses].map((item) => item.value)
      );

      const min = Math.min(
        ...[...newIncomes, ...newExpenses].map((item) => item.value)
      );

      const diff = max - min;

      if (diff < 30) {
        max = 30 - diff + diff;
      }

      setMaxValue(max);
      setMinValue(min);
    }

    let newBreakPoints: number[] = [];

    if (hoursOfDifference <= 2) {
      for (let index = 0; index <= hoursOfDifference; index++) {
        newBreakPoints.push(moment(startDate).add(index, "hour").unix());
      }
    } else {
      const middle = Math.ceil(hoursOfDifference / 2);

      newBreakPoints.push(moment(startDate).unix());

      newBreakPoints.push(moment(startDate).add(middle, "hour").unix());

      newBreakPoints.push(moment(endDate).startOf("hour").unix());
    }

    setBreakpoints(
      newBreakPoints.length === 1
        ? [...newBreakPoints, moment(startDate).add(1, "hour").unix()]
        : newBreakPoints
    );
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

  const getStepValue = (max: number) => {
    return max / 3;
  };

  const getYAxisLabelTexts = (max: number, min: number) => {
    const stepValue = getStepValue(max);

    const steps: number[] = [min];

    for (let i = 1; i <= 3; i++) {
      steps.push(i < 3 ? Math.round(i * stepValue) : max);
    }

    return steps
      .map((val) => {
        if (val <= 10) return val;

        const stringValue = val.toString();

        const lastDigit = parseInt(
          stringValue.split("")[stringValue.length - 1]
        );

        if (lastDigit === 0 || lastDigit === 5) return val;

        if (lastDigit < 5) return parseInt(stringValue.replace(/.$/, "0"));

        if (lastDigit > 5)
          return parseInt((val + 10).toString().replace(/.$/, "0"));

        return val;
      })
      .map((val) => "L " + (val > 999 ? val / 1000 + "K" : val));
  };

  const offset = Math.round(((maxValue - minValue) * 10) / 100);

  //#endregion

  const longPress = Gesture.LongPress();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          className="mt-2 pt-0 -mb-4"
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
            <View className="bg-white dark:bg-[#1A1A1A] rounded-2xl pt-2 mx-3 mt-0 overflow-hidden">
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
                  isAnimated
                  height={150}
                  pointerConfig={{
                    activatePointersOnLongPress: true,
                    pointer1Color:
                      colorScheme === "dark" ? "#5bbe77" : "#02AB5B",
                    pointer2Color:
                      colorScheme === "dark" ? "#FF8092" : "#FF8092",
                    pointerStripWidth: 2,
                    strokeDashArray: [2, 5],
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelHeight: 45,
                    activatePointersDelay: 200,
                    radius: 5,
                    stripOverPointer: true,
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
                            {moment(startDate * 1000)
                              .add(idx, "hour")
                              .format("hh:mm A")}
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
                  yAxisLabelTexts={getYAxisLabelTexts(maxValue, minValue)}
                  yAxisLabelWidth={45}
                  stepHeight={135 / 3}
                  stepValue={getStepValue(maxValue + offset)}
                  maxValue={maxValue + offset}
                  yAxisOffset={minValue === 0 ? -offset : minValue - offset}
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
          <View className="flex flex-row justify-between items-center mt-3 mb-2 mx-3">
            <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#F5F5F5]">
              Latest Transactions
            </Text>

            {transactions.length > 0 && <SeeAllButton />}
          </View>

          <View className="grow mb-6">
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
