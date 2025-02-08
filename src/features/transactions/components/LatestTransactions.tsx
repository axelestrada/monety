import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";
import { Transaction } from "@/features/transactions/components/Transaction";
import { ErrorMessage } from "@/components/ErrorMessage";
import { NoTransactions } from "@/features/transactions/components/NoTransactions";
import { LoadingIndicator } from "@/components/LoadingIndicator";

import useThemeColors from "@/hooks/useThemeColors";

import ITransaction from "@/features/transactions/types/transaction";
import { IconButton } from "@/components/IconButton";
import Animated, {
  FadeIn,
  FadeOut,
  FadingTransition,
  LinearTransition,
} from "react-native-reanimated";

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
    <View className={`mt-4 grow`}>
      <View className="flex-row justify-between items-center -mr-2 px-3">
        <CustomText className="text-lg font-[Rounded-Bold] text-text-primary">
          Latest Transactions
        </CustomText>

        <IconButton onPress={() => router.navigate("/transactions")}>
          <Feather
            size={24}
            name="chevron-right"
            color={colors["--color-icon-primary"]}
          />
        </IconButton>
      </View>

      <Animated.View className="flex-1">
        <LoadingIndicator visible={loading} />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loading && !error ? (
          latestTransactions.length > 0 ? (
            <Animated.View exiting={FadeOut} style={{
              marginBottom: 76
            }}>
              {latestTransactions.map((transaction, index) => (
                <Transaction
                  key={"Transaction: " + transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </Animated.View>
          ) : (
            <NoTransactions />
          )
        ) : null}
      </Animated.View>
    </View>
  );
};
