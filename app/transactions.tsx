import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useTypedSelector } from "../store";
import Header from "@/components/Header/Header";
import IconButton from "@/components/ui/IconButton";
import { Feather } from "@expo/vector-icons";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import Transaction from "@/components/Transaction";
import NoTransactions from "@/components/NoTransactions";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import { useAccounts, useCategories, useTransactions } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { ITransaction } from "@/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { transactionServices } from "@/reducers/transactionsSlice";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import moment from "moment";

const Transactions = () => {
  const { transactions }: { transactions: ITransaction[] } = useTypedSelector(
    (state) => state.transactions
  );
  const { loading } = useTypedSelector((state) => state.userPreferences);

  const [refreshing, setRefreshing] = useState(false);

  const { loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { loadCategories } = useCategories();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts();
    loadTransactions();
    loadCategories();
    setRefreshing(false);
  }, [setRefreshing, loadTransactions, loadAccounts, loadCategories]);

  const { colorScheme } = useColorScheme();

  const format = (number: number) => {
    const formattedNumber = Intl.NumberFormat("en-US").format(number);

    if (number < 0) {
      return "- L " + formattedNumber.toString().slice(1);
    }

    if (number === 0) {
      return "L " + formattedNumber;
    }

    if (number > 0) {
      return "+ L " + formattedNumber;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-[#0D0D0D]">
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "light" ? "#FFFFFF" : "#0D0D0D"}
      />

      <Header overallBalance dateRange />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"]}
            progressBackgroundColor={
              colorScheme === "dark" ? "#1B1D1C" : "#FFFFFF"
            }
          />
        }
      >
        <View className="grow mt-4 dark:mt-2 mb-2 dark:mb-0">
          {transactions.length <= 0 ? (
            <NoTransactions />
          ) : (
            <>
              <View className="flex flex-row justify-between items-center mb-2 mx-3">
                <Text className="font-[Rounded-Bold] text-base text-main dark:text-[#E0E2EE]">
                  {moment(transactions[0].createdAt * 1000).isSame(
                    moment(),
                    "day"
                  )
                    ? "Today"
                    : moment(transactions[0].createdAt * 1000).format(
                        "MMMM DD YYYY"
                      )}
                </Text>

                <Text className="font-[Rounded-Bold] text-base text-main dark:text-[#E0E2EE]">
                  {format(
                    transactions.reduce((acc, cur) => {
                      if (cur.type === "Income") {
                        return acc + cur.amount;
                      }

                      if (cur.type === "Expense") {
                        return acc - cur.amount;
                      }

                      return acc;
                    }, 0)
                  )}
                </Text>
              </View>

              {transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
};

export default Transactions;
