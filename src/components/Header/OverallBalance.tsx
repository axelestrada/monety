import { View } from "react-native";

import DateRange from "@/components/Header/DateRange";
import { CustomText } from "@/components/CustomText";

import formatCurrency from "@/components/Header/utils/formatCurrency";
import calculateOverallBalance from "@/components/Header/utils/calculateOverallBalance";

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

      <CustomText className="font-[Rounded-Bold] text-3.5xl text-text-primary">
        {formatCurrency(totalBalance, {
          spacing: true,
        })}
      </CustomText>

      {showDateRange && <DateRange />}
    </View>
  );
};
