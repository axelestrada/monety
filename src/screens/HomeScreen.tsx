import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, View } from "react-native";

import moment from "moment";

import { useAppDispatch, useTypedSelector } from "@/store";

import { ErrorScreen } from "@/screens/ErrorScreen";
import { SplashScreen } from "@/screens/SplashScreen";

import * as Updates from "expo-updates";

import Screen from "@/components/Screen";
import Header from "@/components/Header/Header";
import { HeaderAction } from "@/components/Header/HeaderAction";
import MainContainer from "@/components/MainContainer";
import CustomAreaChart from "@/features/analytics-charts/LineAreaChart/CustomAreaChart";
import { TransactionSummaryButton } from "@/features/transactions/components/TransactionSummaryButton";
import { LatestTransactions } from "@/features/transactions/components/LatestTransactions";
import PointerLabelComponent from "@/features/analytics-charts/LineAreaChart/PointerLabelComponent";

import { useColorScheme } from "nativewind";
import { lineDataItem } from "react-native-gifted-charts";

import { getYAxisLabelTexts } from "@/features/analytics-charts/LineAreaChart/utils/getYAxisLabelTexts";
import { calculateMaxValue } from "@/features/analytics-charts/LineAreaChart/utils/calculateMaxValue";

import useThemeColors from "@/hooks/useThemeColors";
import useDatabase from "@/hooks/useDatabase";

import { DateRangePickerProvider } from "@/components/DateRangePicker/DateRangePickerContext";
import useLatestTransactions from "@/features/transactions/hooks/useLatestTransactions";
import { useSQLiteContext } from "expo-sqlite";
import { categoriesServices } from "@/features/categories/redux/reducers/categoriesSlice";
import { normalizeCategory } from "@/features/categories/normalizers/normalizeCategory";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { DateRangePicker } from "@/components/DateRangePicker/DateRangePicker";

const data: {
  incomes: lineDataItem[];
  expenses: lineDataItem[];
} = {
  incomes: [
    { value: 0 },
    { value: 230 },
    { value: 130 },
    { value: 97 },
    { value: 189 },
    { value: 50 },
    { value: 0 },
    { value: 190 },
    { value: 79 },
    { value: 120 },
  ],
  expenses: [
    { value: 120 },
    { value: 0 },
    { value: 49 },
    { value: 79 },
    { value: 16 },
    { value: 150 },
    { value: 200 },
    { value: 98 },
    { value: 0 },
    { value: 18 },
  ],
};

export default function HomeScreen() {
  const colors = useThemeColors();

  const { toggleColorScheme, colorScheme } = useColorScheme();

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const { error, loading, initializeDatabase } = useDatabase();
  const [refreshing, setRefreshing] = useState(false);

  const latestTransactions = useLatestTransactions();
  const db = useSQLiteContext();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await latestTransactions.getLatestTransactions();

    setRefreshing(false);
  }, []);

  const dispatch = useAppDispatch();

  const getData = useCallback(async () => {
    const categories = await db.getAllAsync<any>("SELECT * FROM Categories;");
    const accounts = await db.getAllAsync<any>("SELECT * FROM Accounts;");

    console.table(categories);
    console.table(accounts);

    dispatch(
      categoriesServices.actions.setCategories(
        categories.map((category) => normalizeCategory(category))
      )
    );

    dispatch(
      accountsServices.actions.setAccounts(
        accounts.map((account) => normalizeAccount(account))
      )
    );
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  useEffect(() => {
    if (!loading && !error) {
      getData();
    }
  }, [getData, loading, error]);

  const checkForUpdates = useCallback(async () => {
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
      Alert.alert(
        "Error",
        "Error al comprobar si hay una nueva actualización " + e
      );
    }
  }, []);

  useEffect(() => {
    if (!__DEV__) {
      checkForUpdates();
    }
  }, [checkForUpdates]);

  if (loading) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Database Initialization Error"
        description="An unexpected error occurred while initializing the database. Please try again. If the issue persists, contact support for assistance."
        onTryAgain={initializeDatabase}
      />
    );
  }

  const legendItems = [
    { color: colors["--color-income"], label: "Incomes" },
    { color: colors["--color-expense"], label: "Expenses" },
  ];

  const max = Math.max(
    ...[...data.incomes, ...data.expenses].map((item) => item.value)
  );

  const maxValue = calculateMaxValue(0, max);
  const yAxisLabelTexts = getYAxisLabelTexts(0, max, 3);

  const getPointerLabelComponentTitle = (index: number): string =>
    moment(dateRange.from * 1000)
      .add(index, "hours")
      .format("hh:mm A");

  const getHeaderTitle = (): string => {
    const from = moment(dateRange.from * 1000);
    const to = moment(dateRange.to * 1000);

    if (from.isSame(to, "day")) {
      if (from.isSame(moment(), "day")) {
        return "Today";
      }

      if (from.isSame(moment().subtract(1, "day"), "day")) {
        return "Yesterday";
      }

      if (from.isSame(moment().add(1, "day"), "day")) {
        return "Tomorrow";
      }
    }

    return "Monety";
  };

  return (
    <Screen showBottomNavigationBar>
      <DateRangePickerProvider>
        <Header overallBalance showDateRange title={getHeaderTitle()}>
          <HeaderAction
            icon={colorScheme === "dark" ? "sun" : "moon"}
            onPress={toggleColorScheme}
          />
          <HeaderAction icon="calendar" />
        </Header>

        <DateRangePicker />
      </DateRangePickerProvider>

      <MainContainer onRefresh={onRefresh} refreshing={refreshing}>
        <CustomAreaChart
          title="Statistics"
          legendItems={legendItems}
          data={data.incomes}
          data2={data.expenses}
          color1={colors["--color-income"]}
          color2={colors["--color-expense"]}
          startFillColor1={colors["--color-income"]}
          startFillColor2={colors["--color-expense"]}
          yAxisLabelTexts={yAxisLabelTexts}
          maxValue={maxValue}
          pointerConfig={{
            pointer1Color: colors["--color-income"],
            pointer2Color: colors["--color-expense"],
          }}
          pointerLabelComponent={(items, index) => (
            <PointerLabelComponent
              title={getPointerLabelComponentTitle(index)}
              items={items.map((item, index) => ({
                value: (index === 0 ? "+" : "-") + "L" + item.value,
                color:
                  index === 0
                    ? colors["--color-income"]
                    : colors["--color-expense"],
              }))}
            />
          )}
        />

        <View className="flex-row mt-3">
          <TransactionSummaryButton type="income" value={230} active />

          <View className="w-3" />

          <TransactionSummaryButton type="expense" value={120} active />
        </View>

        <LatestTransactions {...latestTransactions} />
      </MainContainer>
    </Screen>
  );
}
