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

export default function Transactions() {
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();

  const [transaction, setTransaction] = useState({
    date: moment().unix(),
    createdAt: moment().startOf("day").unix(),
    amount: 0,
    comment: "",
    originId: 0,
    destinationId: 0,
    type: "income",
  });

  const handleSubmit = useCallback(async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO Transactions (date, created_at, amount, comment, origin_id, destination_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [
            transaction.date,
            transaction.createdAt,
            transaction.amount,
            transaction.comment || null,
            transaction.originId,
            transaction.destinationId,
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
          date: moment().unix(),
          createdAt: moment().startOf("day").unix(),
          amount: 0,
          comment: "",
          originId: 0,
          destinationId: 0,
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
        <Text>date: {transaction.date}</Text>
        <Text>createdAt: {transaction.createdAt}</Text>
        <Text>amount: {transaction.amount}</Text>
        <Text>comment: {transaction.comment}</Text>
        <Text>originId: {transaction.originId}</Text>
        <Text>destinationId: {transaction.destinationId}</Text>
        <Text>type: {transaction.type}</Text>
      </View>

      <TextInput
        placeholder="Amount"
        className="bg-red m-3 p-3 text-white"
        keyboardType="numeric"
        value={transaction.amount.toString()}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, amount: parseFloat(text) }))
        }
      />

      <TextInput
        placeholder="Comment"
        className="bg-red m-3 p-3 text-white"
        value={transaction.comment}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, comment: text }))
        }
      />

      <TextInput
        placeholder="Origin"
        className="bg-red m-3 p-3 text-white"
        value={transaction.originId.toString()}
        keyboardType="numeric"
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, originId: parseFloat(text) }))
        }
      />

      <TextInput
        placeholder="Destination"
        className="bg-red m-3 p-3 text-white"
        value={transaction.destinationId.toString()}
        keyboardType="numeric"
        onChangeText={(text) =>
          setTransaction((prev) => ({
            ...prev,
            destinationId: parseFloat(text),
          }))
        }
      />

      <TextInput
        placeholder="Type"
        className="bg-red m-3 p-3 text-white"
        value={transaction.type}
        onChangeText={(text) =>
          setTransaction((prev) => ({ ...prev, type: text }))
        }
      />

      <Button title="Submit" onPress={handleSubmit} />
    </Screen>
  );
}
