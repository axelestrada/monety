import { View } from "react-native";

import DateRange from "@/components/Header/DateRange";
import { CustomText } from "@/components/CustomText";

import calculateOverallBalance from "@/components/Header/utils/calculateOverallBalance";
import { AnimatedRollingNumbers } from "@/components/AnimatedRollingNumbers";

interface OverallBalanceProps {
  showDateRange?: boolean;
}

export const OverallBalance = ({ showDateRange }: OverallBalanceProps) => {
  const totalBalance = calculateOverallBalance();

  return (
    <View className="justify-center items-center">
      <CustomText className="text-xs text-text-primary-75">
        Overall balance
      </CustomText>

      <AnimatedRollingNumbers
        showMinusSign
        value={totalBalance}
        showCurrency
        currency="L"
        spacing
      />

      {showDateRange && <DateRange />}
    </View>
  );
};
