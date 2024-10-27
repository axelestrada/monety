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
      setIncomes([{ value: 0 }]);
      setExpenses([{ value: 0 }]);
      setMaxValue(100);
      setMinValue(0);
      return;
    } else {
      if (newIncomes.length === 0) {
        setIncomes([{ value: 0 }]);
      } else {
        setIncomes(
          newIncomes.length === 1
            ? [...newIncomes, { value: 0 }]
            : [...newIncomes]
        );
      }

      if (newExpenses.length === 0) {
        setExpenses([{ value: 0 }]);
      } else {
        setExpenses(
          newExpenses.length === 1
            ? [...newExpenses, { value: 0 }]
            : [...newExpenses]
        );
      }

      setMaxValue(
        Math.max(...[...newIncomes, ...newExpenses].map((item) => item.value))
      );
      setMinValue(
        newIncomes.length === 1 || newExpenses.length === 1
          ? 0
          : Math.min(
              ...[...newIncomes, ...newExpenses].map((item) => item.value)
            )
      );
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
  //#endregion

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

        <View className="bg-white dark:bg-[#1A1A1A] rounded-2xl pt-2 mx-3 mt-2 overflow-hidden">
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
                pointer1Color: colorScheme === "dark" ? "#5bbe77" : "#02AB5B",
                pointer2Color: colorScheme === "dark" ? "#FF8092" : "#FF8092",
                pointerStripWidth: 2,
                strokeDashArray: [2, 5],
                pointerStripUptoDataPoint: true,
                autoAdjustPointerLabelPosition: true,
                pointerLabelHeight: 45,
                radius: 5,
                stripOverPointer: true,
                pointerVanishDelay: 500,
                pointerLabelComponent: (items: any, si: any, idx: number) => {
                  return idx >= 0 ? (
                    <View
                      className="z-20"
                      style={{
                        width: 80,
                        height: 40,
                        backgroundColor:
                          colorScheme === "light" ? "#FFFFFF" : "#383838",
                        borderRadius: 8,
                        paddingVertical: 4,
                        elevation: colorScheme === "dark" ? 0 : 8,
                        alignItems: "center",
                        justifyContent: "space-between",
                        left:
                          idx === 0
                            ? 10
                            : idx === incomes.length - 1
                            ? 0
                            : idx === incomes.length - 2 &&
                              (screenWidth - 82) / (incomes.length - 1) < 90
                            ? -50
                            : 50,
                      }}
                    >
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C",
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
                              colorScheme === "dark" ? "#5bbe77" : "#02AB5B",
                            fontFamily: "Rounded-Medium",
                            fontSize: 12,
                          }}
                        >
                          +L{items[0].value}
                        </Text>
                        <Text
                          style={{
                            color:
                              colorScheme === "dark" ? "#FF8092" : "#FF8092",
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
              startFillColor1={colorScheme === "dark" ? "#5bbe77" : "#02AB5B"}
              startFillColor2={colorScheme === "dark" ? "#FF8092" : "#FF8092"}
              endFillColor1={colorScheme === "dark" ? "#5bbe77" : "#02AB5B"}
              endFillColor2={colorScheme === "dark" ? "#FF8092" : "#FF8092"}
              startOpacity={0.3}
              endOpacity={0}
              curved
              curveType={1}
              initialSpacing={12}
              spacing={
                incomes.length === 1
                  ? screenWidth - 82
                  : (screenWidth - 82) / (incomes.length - 1) > 50
                  ? (screenWidth - 82) / (incomes.length - 1)
                  : 50
              }
              endSpacing={
                incomes.length === 1
                  ? -(screenWidth - 82)
                  : -((screenWidth - 82) / (incomes.length - 1) - 12)
              }
              hideDataPoints
              stepValue={
                incomes.length === 1
                  ? maxValue
                  : minValue === 0
                  ? maxValue / 3
                  : (maxValue - minValue) / 3
              }
              maxValue={
                incomes.length === 1
                  ? maxValue
                  : minValue === 0
                  ? maxValue + 10
                  : maxValue - (minValue - 10)
              }
              yAxisOffset={
                incomes.length === 1 ? 0 : minValue === 0 ? -10 : minValue - 10
              }
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{
                color: colorScheme === "dark" ? "#F5F5F580" : "#1B1D1C80",
                fontFamily: "Rounded-Regular",
                fontSize: 12,
              }}
              yAxisLabelPrefix="L "
              rulesColor={colorScheme === "dark" ? "#f5f5f51a" : "#1B1D1C1a"}
            />
          </View>
        </View>

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

        <View className="flex flex-row justify-between items-center mt-3 mx-3">
          <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#F5F5F5]">
            Latest Transactions
          </Text>

          {transactions.length > 0 && <SeeAllButton />}
        </View>

        <ScrollView
          className="mt-1 pt-1 -mb-4"
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
