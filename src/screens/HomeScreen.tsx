import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";

import moment from "moment";

import { useAppDispatch, useTypedSelector } from "@/store";

import { ErrorScreen } from "@/screens/ErrorScreen";
import { SplashScreen } from "@/screens/SplashScreen";

import * as Updates from "expo-updates";

import Screen from "@/components/Screen";
import Header from "@/components/Header/Header";
import { HeaderAction } from "@/components/Header/HeaderAction";
import MainContainer from "@/components/MainContainer";
import { TransactionSummaryButton } from "@/features/transactions/components/TransactionSummaryButton";
import { LatestTransactions } from "@/features/transactions/components/LatestTransactions";

import { useColorScheme } from "nativewind";
import useDatabase from "@/hooks/useDatabase";

import { DateRangePickerProvider } from "@/components/DateRangePicker/DateRangePickerContext";
import useLatestTransactions from "@/features/transactions/hooks/useLatestTransactions";
import { useSQLiteContext } from "expo-sqlite";
import { categoriesServices } from "@/features/categories/redux/reducers/categoriesSlice";
import { normalizeCategory } from "@/features/categories/normalizers/normalizeCategory";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { DateRangePicker } from "@/components/DateRangePicker/DateRangePicker";
import { HomeAnalyticsChart } from "@/components/HomeAnalyticsChart";

export default function HomeScreen() {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const { error, loading, initializeDatabase } = useDatabase();
  const [refreshing, setRefreshing] = useState(false);

  const latestTransactions = useLatestTransactions();
  const db = useSQLiteContext();

  const dispatch = useAppDispatch();

  const getData = useCallback(async () => {
    const categories = await db.getAllAsync<any>("SELECT * FROM Categories;");
    const accounts = await db.getAllAsync<any>("SELECT * FROM Accounts;");

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await latestTransactions.getLatestTransactions();

    setRefreshing(false);
  }, [getData, latestTransactions]);

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
        <Header drawer overallBalance showDateRange title={getHeaderTitle()}>
          <HeaderAction
            icon={colorScheme === "dark" ? "sun" : "moon"}
            onPress={toggleColorScheme}
          />
          <HeaderAction icon="calendar" />
        </Header>

        <DateRangePicker />
      </DateRangePickerProvider>

      <MainContainer onRefresh={onRefresh} refreshing={refreshing}>
        <HomeAnalyticsChart />

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
