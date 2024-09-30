import { Text, View } from "react-native";
import SeeAllButton from "./ui/SeeAllButton";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";
import { useTypedSelector } from "@/store";

const TransactionsList = () => {
  const {transactions} = useTypedSelector((state) => state.transactions)

  return (
    <View className="grow mb-6">
      <View className="flex flex-row justify-between items-center mt-3 mb-2 mx-3">
        <Text className="font-[Rounded-Bold] text-lg text-main dark:text-[#E0E2EE]">
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
