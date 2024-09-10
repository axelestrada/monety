import React, { useEffect, useState } from "react";

import { Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTypedSelector, useAppDispatch } from "../store";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import Header from "@/components/Header";
import IconButton from "@/components/ui/IconButton";
import { Feather } from "@expo/vector-icons";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import TransactionsList from "@/components/TransactionsList";
import Transaction from "@/components/Transaction";
import NoTransactions from "@/components/NoTransactions";
import ITransaction from "@/interfaces/transaction";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import { useSQLiteContext } from "expo-sqlite";
import { transactionServices } from "@/reducers/transactionsSlice";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useTypedSelector((state) => state.transactions);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await db.getAllAsync<ITransaction[]>(`
          SELECT Transactions.id, Transactions.created_at as createdAt, Transactions.comment, Transactions.date, Transactions.amount,
            Transactions.type, Categories.color AS categoryColor, Categories.icon AS categoryIcon,
            Categories.name AS categoryName, Accounts.name as accountName
          FROM Transactions
          INNER JOIN Categories ON Categories.id = Transactions.category_id
          INNER JOIN Accounts ON Accounts.id = Transactions.account_id
          ORDER BY Transactions.date DESC;
        `);

        dispatch(transactionServices.actions.updateTransactions(result));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
    <SafeAreaView className="flex-1">
      <BackgroundGradient />

      <Header title="Transactions">
        <IconButton>
          <Feather name="filter" color="#1B1D1C" size={20} />
        </IconButton>
      </Header>

      <OverallBalance>
        <TimeRange />
      </OverallBalance>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="-mb-6">
        <View className="rounded-md grow mb-6">
          {transactions.length <= 0 ? (
            <NoTransactions />
          ) : (
            <>
              <View className="flex flex-row justify-between items-center mb-2 mx-3">
                <Text className="font-[Rounded-Bold] text-lg text-main">
                  Today
                </Text>

                <Text className="font-[Rounded-Bold] text-lg text-main">
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
