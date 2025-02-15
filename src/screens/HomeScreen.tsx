import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  Vibration,
  View,
} from "react-native";

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
import { HomeAnalyticsChart } from "@/features/analytics-charts/HomeAnalyticsChart";
import useThemeColors from "@/hooks/useThemeColors";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureType,
  NativeGesture,
} from "react-native-gesture-handler";
import { Transaction } from "@/features/transactions/components/Transaction";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import ITransaction from "@/features/transactions/types/transaction";
import { AlertProvider } from "@/components/Alert/AlertContext";
const SWIPE_THRESHOLD = 55;
const BUTTON_WIDTH = 70;

export default function HomeScreen() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const colors = useThemeColors();

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const { error, loading, initializeDatabase } = useDatabase();
  const [refreshing, setRefreshing] = useState(false);

  const latestTransactions = useLatestTransactions();
  const db = useSQLiteContext();

  const dispatch = useAppDispatch();

  const [scrollEnabled, setScrollEnabled] = useState(true);

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

    latestTransactions.getLatestTransactions();
  }, [latestTransactions.getLatestTransactions]);

  const translateX = useSharedValue(0);
  const transactionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  const [showActions, setShowActions] = useState(false);

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

  const nativeGesture = Gesture.Native();

  return (
    <AlertProvider>
      <Screen>
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

        <MainContainer>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-main-background pb-4 relative"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors["--color-text-secondary"]]}
                progressBackgroundColor={colors["--color-card-background"]}
              />
            }
          >
            <View className="px-3">
              <HomeAnalyticsChart refreshing={refreshing} />
            </View>

            <LatestTransactions
              {...latestTransactions}
              externalScrollGesture={nativeGesture}
            />
          </Animated.ScrollView>
        </MainContainer>
      </Screen>
    </AlertProvider>
  );
}
