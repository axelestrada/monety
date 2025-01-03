import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";
import { Transaction } from "@/components/Transaction";
import { ErrorMessage } from "@/components/ErrorMessage";
import { NoTransactions } from "@/components/NoTransactions";
import { LoadingIndicator } from "@/components/LoadingIndicator";

import useThemeColors from "@/hooks/useThemeColors";

import ITransaction from "@/interfaces/transaction";

interface LatestTransactionsProps {
  loading: boolean;
  error: string | null;
  latestTransactions: ITransaction[];
  getLatestTransactions: () => void;
}

export const LatestTransactions = ({
  loading,
  error,
  latestTransactions,
  getLatestTransactions,
}: LatestTransactionsProps) => {
  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    getLatestTransactions();
  }, [getLatestTransactions]);

  return (
    <View className="mt-4 grow">
      <View className="flex-row justify-between items-center">
        <CustomText className="text-lg font-[Rounded-Bold] text-text-primary">
          Latest Transactions
        </CustomText>

        <TouchableOpacity onPress={() => router.navigate("/transactions")}>
          <Feather
            size={24}
            name="chevron-right"
            color={colors["--color-icon-primary"]}
          />
        </TouchableOpacity>
      </View>

      <View className="my-1 flex-1">
        {error ? (
          <ErrorMessage />
        ) : loading ? (
          <LoadingIndicator />
        ) : latestTransactions.length === 0 ? (
          <NoTransactions />
        ) : (
          latestTransactions.map((transaction) => (
            <Transaction
              key={"Transaction: " + transaction.id}
              transaction={transaction}
            />
          ))
        )}
      </View>
    </View>
  );
};
