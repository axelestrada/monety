import { useTypedSelector } from "@/store";
import { ReactElement } from "react";
import { Text, View } from "react-native";

interface Props {
  children?: ReactElement;
}

const OverallBalance = ({ children }: Props) => {
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
    <View className={`justify-center items-center p-2 pb-4`}>
      <Text className="text-[#1b1d1cbf] dark:text-[#FFFFFFbf] text-xs">Overall balance</Text>
      <Text className="text-main dark:text-white font-[Rounded-Bold] text-[34px]">
        {formatNumber(
          accounts.reduce(
            (acc, curr) =>
              curr.includeInOverallBalance ? acc + curr.currentBalance : acc,
            0
          )
        )}
      </Text>

      {children}
    </View>
  );
};

export default OverallBalance;
