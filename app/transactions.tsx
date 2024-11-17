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
import _ from "lodash";
import { formatCurrency } from "@/utils";

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

  const groupTransactionsByDate = (
    transactions: ITransaction[]
  ): { date: number; transactions: ITransaction[] }[] => {
    const grouped = transactions.reduce((groups, transaction) => {
      const dateKey = moment(transaction.createdAt * 1000)
        .startOf("day")
        .valueOf()
        .toString(); // Convertimos la fecha a string para usarla como clave
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    }, {} as Record<string, ITransaction[]>);

    // Transformar el objeto a un arreglo con la estructura deseada
    return Object.entries(grouped)
      .map(([date, transactions]) => ({
        date: Number(date), // Convertimos la clave nuevamente a número
        transactions,
      }))
      .sort((a, b) => b.date - a.date);
  };

  const groupedTransactions = groupTransactionsByDate(transactions);
  console.log(groupedTransactions);

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
          {groupedTransactions.length <= 0 ? (
            <NoTransactions />
          ) : (
            groupedTransactions.map(({ date, transactions }) => (
              <>
                <View className="flex flex-row justify-between items-center mb-2 mx-3">
                  <Text className="font-[Rounded-Bold] text-base text-main dark:text-[#E0E2EE]">
                    {moment(date).isSame(moment(), "day")
                      ? "Today"
                      : moment(date).format("ddd, MMM DD")}
                  </Text>

                  <Text className="font-[Rounded-Bold] text-base text-main dark:text-[#E0E2EE]">
                    {formatCurrency(
                      transactions.reduce((acc, cur) => {
                        if (cur.type === "Income") {
                          return acc + cur.amount;
                        }

                        if (cur.type === "Expense") {
                          return acc - cur.amount;
                        }

                        return acc;
                      }, 0),
                      {
                        showSign: "always",
                        spacing: true,
                      }
                    )}
                  </Text>
                </View>

                {transactions.map((transaction) => (
                  <Transaction key={transaction.id} transaction={transaction} />
                ))}
              </>
            ))
          )}
        </View>
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
};

export default Transactions;
