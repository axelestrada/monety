import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { firstLetterUppercase, numberWithCommas } from "@/utils/format";
import { styles } from "@/styles/shadow";
import { useColorScheme } from "nativewind";

interface Props {
  type: "Incomes" | "Expenses";
  value: number;
  active?: boolean;
  onPress?: () => void;
}

const CashFlowItem = ({ type, value, onPress, active = true }: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`${
        active && "bg-white dark:bg-[#1A1A1A]"
      } flex flex-1 rounded-2xl py-2.5 px-2 mx-1.5 flex-row items-center shadow-md shadow-main-25`}
    >
      <View
        className={`${
          type === "Incomes"
            ? "bg-green-10 dark:bg-[#5bbe771a]"
            : "bg-red-10 dark:bg-[#FF80921a]"
        } justify-center items-center p-4 mr-1.5 rounded-full`}
      >
        <Feather
          name={`${type === "Incomes" ? "arrow-down-left" : "arrow-up-right"}`}
          color={`${
            type === "Incomes"
              ? colorScheme === "dark"
                ? "#5bbe77"
                : "#02AB5B"
              : colorScheme === "dark"
              ? "#FF8092"
              : "#FF8092"
          }`}
          size={18}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          className={`${
            type === "Incomes"
              ? "text-green dark:text-[#5bbe77]"
              : "text-red dark:text-[#FF8092]"
          } text-lg font-[Rounded-Bold] -mb-0.5`}
        >
          {"L " + Intl.NumberFormat("en-US").format(value)}
        </Text>

        <Text className="text-main dark:text-[#F5F5F5] font-[Rounded-Bold] text-lg">
          {type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CashFlowItem;
