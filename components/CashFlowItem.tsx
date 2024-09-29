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
        active && "bg-white dark:bg-[#131416]"
      } flex flex-1 rounded-2xl py-3 px-2 mx-1.5 flex-row items-center`}
      style={active ? styles.shadow : {}}
    >
      <View
        className={`${
          type === "Incomes" ? "bg-green-10" : "bg-red-10"
        } justify-center items-center p-4 mr-1.5 rounded-full`}
      >
        <Feather
          name={`${type === "Incomes" ? "arrow-down-left" : "arrow-up-right"}`}
          color={`${
            type === "Incomes"
              ? colorScheme === "dark"
                ? "#4EC871"
                : "#02AB5B"
              : colorScheme === "dark"
              ? "#E95A5C"
              : "#FF8092"
          }`}
          size={18}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          className={`${
            type === "Incomes"
              ? "text-green dark:text-[#4EC871]"
              : "text-red dark:text-[#E95A5C]"
          } text-lg font-[Rounded-Bold] -mb-0.5`}
        >
          {"L " + Intl.NumberFormat("en-US").format(value)}
        </Text>

        <Text className="text-main dark:text-white font-[Rounded-Bold] text-lg">{type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CashFlowItem;
