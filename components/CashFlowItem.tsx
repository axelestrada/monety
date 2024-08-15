import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { firstLetterUppercase, numberWithCommas } from "@/utils/format";
import styles from "@/styles/shadow";

interface Props {
  type: "incomes" | "expenses";
  value: number;
  active?: boolean;
  onPress?: () => void;
}

const CashFlowItem = ({ type, value, onPress, active = true }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className={`${
        active && "bg-white"
      } flex flex-1 rounded-2xl py-3 px-2 mx-2 flex-row items-center`}
      style={active ? styles.shadow : {}}
    >
      <View
        className={`${
          type === "incomes" ? "bg-green-10" : "bg-red-10"
        } justify-center items-center p-4 mr-3 rounded-full`}
      >
        <Feather
          name={`${type === "incomes" ? "arrow-down-left" : "arrow-up-right"}`}
          color={`${type === "incomes" ? "#3FE671" : "#FF8092"}`}
          size={18}
        />
      </View>

      <View>
        <Text
          className={`${
            type === "incomes" ? "text-green" : "text-red"
          } text-lg font-[Rounded-Bold]`}
        >
          {"L " + numberWithCommas(value)}
        </Text>

        <Text className="text-main font-[Rounded-Bold] text-lg">
          {firstLetterUppercase(type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CashFlowItem;
