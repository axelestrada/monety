import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useTypedSelector } from "../store";
import Header from "@/components/Header";
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
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-[#00000080] justify-center items-center">
          <ActivityIndicator color={"#FFFFFF"} size={32} />
        </View>
      )}

      <Header title="Transactions">
        <IconButton>
          <Feather
            name="filter"
            color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
            size={20}
          />
        </IconButton>
      </Header>

      <OverallBalance>
        <TimeRange />
      </OverallBalance>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="-mb-6"
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
        <View className="rounded-md grow mb-6">
          {transactions.length <= 0 ? (
            <NoTransactions />
          ) : (
            <>
              <View className="flex flex-row justify-between items-center mb-2 mx-3">
                <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#E0E2EE]">
                  Today
                </Text>

                <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#E0E2EE]">
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
