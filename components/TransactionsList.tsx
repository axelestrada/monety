import { Text, View } from "react-native";
import SeeAllButton from "./ui/SeeAllButton";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";
import { useTypedSelector } from "@/store";

const TransactionsList = () => {
  const {transactions} = useTypedSelector((state) => state.transactions)

  return (
    <View className="my-4 rounded-md grow">
      <View className="flex flex-row justify-between items-center mb-3 mx-4">
        <Text className="font-[Rounded-Bold] text-xl text-main">
          Latest Transactions
        </Text>

        {transactions.length > 0 && <SeeAllButton />}
      </View>

      {transactions.length > 0 ? (
        transactions.slice(0, 5).map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <NoTransactions />
      )}
    </View>
  );
};

export default TransactionsList;
