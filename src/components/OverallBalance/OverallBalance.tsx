import { Text, View } from "react-native";

import { TimeRange } from "@/components";

import { useTypedSelector } from "@/store";

interface Props {
  timeRange?: boolean;
}

const OverallBalance = ({ timeRange }: Props) => {
  const { accounts } = useTypedSelector((state) => state.accounts);

  const formatNumber = (number: number) => {
    const formattedNumber = Intl.NumberFormat("en-US").format(number);

    if (number < 0) {
      return "- L " + formattedNumber.toString().slice(1);
    }

    if (number >= 0) {
      return "L " + formattedNumber;
    }
  };

  return (
    <View className={`justify-center items-center`}>
      <Text className="text-main-75 dark:text-[#F5F5F5bf] text-xs">
        Overall balance
      </Text>

      <Text className="text-main dark:text-[#F5F5F5] font-[Rounded-Bold] text-3.5xl">
        {formatNumber(
          accounts.reduce(
            (acc, curr) =>
              curr.includeInOverallBalance ? acc + curr.currentBalance : acc,
            0
          )
        )}
      </Text>

      {timeRange && <TimeRange />}
    </View>
  );
};

export default OverallBalance;
