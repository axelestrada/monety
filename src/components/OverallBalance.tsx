import { Text, View } from "react-native";

import { useTypedSelector } from "@/store";
import { formatCurrency } from "@/utils";

import DateRange from "@/components/DateRange";

interface Props {
  dateRange?: boolean;
}

const OverallBalance = ({ dateRange }: Props) => {
  const { accounts } = useTypedSelector((state) => state.accounts);

  const totalBalance = accounts.reduce(
    (acc, account) =>
      account.includeInOverallBalance ? acc + account.currentBalance : acc,
    0
  );

  return (
    <View className={`justify-center items-center`}>
      <Text className="text-main-75 dark:text-[#F5F5F5bf] text-xs">
        Overall balance
      </Text>

      <Text className="text-main dark:text-[#F5F5F5] font-[Rounded-Bold] text-3.5xl">
        {formatCurrency(totalBalance, {
          spacing: true,
        })}
      </Text>

      {dateRange && <DateRange />}
    </View>
  );
};

export default OverallBalance;
