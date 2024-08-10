import { TransactionInterface } from "@/interfaces/transaction";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import SeeAllButton from "./ui/SeeAllButton";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";

const data: TransactionInterface[] = [
  {
    id: "2436874573958",
    type: "income",
    amount: 120,
    category: {
      name: "In Driver",
      color: "#3FE671",
      icon: "taxi",
    },
    account: {
      name: "Cash",
      color: "#3FE671",
      icon: "money-bill",
    },
    createdAt: new Date(2024, 7, 6),
    date: new Date(2024, 7, 6, 13, 23),
  },
  {
    id: "243687456767858",
    type: "expense",
    amount: 1350,
    category: {
      name: "Fuel",
      color: "#FF9257",
      icon: "gas-pump",
    },
    account: {
      name: "Cash",
      color: "#FF9257",
      icon: "money-bill",
    },
    createdAt: new Date(2024, 7, 8),
    date: new Date(2024, 7, 6, 13, 23),
  },
  {
    id: "395843756380647",
    type: "income",
    amount: 130,
    category: {
      name: "In Driver",
      color: "#3FE671",
      icon: "taxi",
    },
    account: {
      name: "Cash",
      color: "#3FE671",
      icon: "money-bill",
    },
    createdAt: new Date(2024, 7, 9),
    date: new Date(2024, 7, 6, 13, 23),
  },
];

const data3: TransactionInterface[] = [];

const TransactionsList = () => {
  return (
    <View className="mt-4 rounded-md grow">
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="font-[Rounded-Bold] text-xl text-main">
          Recent Transactions
        </Text>

        {data.length > 0 && <SeeAllButton />}
      </View>

      {data.length > 0 ? (
        data.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <NoTransactions />
      )}
    </View>
  );
};

export default TransactionsList;
