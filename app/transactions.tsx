import Header from "@/components/Header/Header";
import Screen from "@/components/Screen";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import { useAppDispatch } from "@/store";
import { useSQLiteContext } from "expo-sqlite";
import moment from "moment";
import { useCallback, useState } from "react";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { parse } from "react-native-svg";

export default function Transactions() {
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();

  const [transaction, setTransaction] = useState({
    date: moment().unix().toString(),
    createdAt: moment().startOf("day").unix(),
    amount: "",
    comment: "",
    originId: "",
    destinationId: "",
    type: "expense",
  });

  const handleSubmit = useCallback(async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO Transactions (date, created_at, amount, comment, origin_id, destination_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [
            parseInt(transaction.date),
            transaction.createdAt,
            parseFloat(transaction.amount),
            transaction.comment || null,
            parseFloat(transaction.originId),
            parseFloat(transaction.destinationId),
            transaction.type,
          ]
        );

        if (transaction.type === "income") {
          await db.runAsync(
            "UPDATE Accounts SET current_balance = current_balance + ? WHERE id = ?",
            [transaction.amount, transaction.destinationId]
          );
        } else {
          await db.runAsync(
            "UPDATE Accounts SET current_balance = current_balance - ? WHERE id = ?",
            [transaction.amount, transaction.originId]
          );
        }

        const accounts = await db.getAllAsync<any>("SELECT * FROM Accounts;");
        dispatch(
          accountsServices.actions.setAccounts(
            accounts.map((account) => normalizeAccount(account))
          )
        );

        setTransaction({
          date: moment().unix().toString(),
          createdAt: moment().startOf("day").unix(),
          amount: "",
          comment: "",
          originId: "",
          destinationId: "",
          type: "income",
        });
      });
    } catch (error) {
      console.error("Error inserting transaction: ", error);
      alert("Error inserting transaction");
    }
  }, [transaction]);

  return (
    <Screen>
      <Header title="Transactions" overallBalance showDateRange drawer />

      <View className="mx-3">
        <Text className="text-text-primary">date: {transaction.date}</Text>
        <Text className="text-text-primary">
          createdAt: {transaction.createdAt}
        </Text>
        <Text className="text-text-primary">amount: {transaction.amount}</Text>
        <Text className="text-text-primary">
          comment: {transaction.comment}
        </Text>
        <Text className="text-text-primary">
          originId: {transaction.originId}
        </Text>
        <Text className="text-text-primary">
          destinationId: {transaction.destinationId}
        </Text>
        <Text className="text-text-primary">type: {transaction.type}</Text>
      </View>

      <TextInput
        placeholder="Date"
        className="bg-card-background m-3 p-3 text-text-primary"
        keyboardType="numeric"
        value={transaction.date}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, date: text }))
        }
      />

      <TextInput
        placeholder="Amount"
        className="bg-card-background m-3 p-3 text-text-primary"
        keyboardType="numeric"
        value={transaction.amount}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, amount: text }))
        }
      />

      <TextInput
        placeholder="Comment"
        className="bg-card-background m-3 p-3 text-text-primary"
        value={transaction.comment}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, comment: text }))
        }
      />

      <TextInput
        placeholder="Origin"
        className="bg-card-background m-3 p-3 text-text-primary"
        value={transaction.originId}
        keyboardType="numeric"
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, originId: text }))
        }
      />

      <TextInput
        placeholder="Destination"
        className="bg-card-background m-3 p-3 text-text-primary"
        value={transaction.destinationId}
        keyboardType="numeric"
        onChangeText={(text) =>
          setTransaction((prev) => ({
            ...prev,
            destinationId: text,
          }))
        }
      />

      <TextInput
        placeholder="Type"
        className="bg-card-background m-3 p-3 text-text-primary"
        value={transaction.type}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, type: text }))
        }
      />

      <Button title="Submit" onPress={handleSubmit} />
    </Screen>
  );
}
