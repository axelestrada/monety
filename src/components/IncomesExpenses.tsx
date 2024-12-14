import useThemeColors from "@/hooks/useThemeColors";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import CustomText from "@/components/CustomText";
import formatCurrency from "@/utils/formatCurrency";

interface IncomesExpensesProps {
  type: "income" | "expense";
  value: number;
  onPress?: () => void;
  active: boolean;
}

const IncomesExpenses = ({
  active,
  type,
  value,
  onPress,
}: IncomesExpensesProps) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${
        active ? "bg-card-background" : "bg-none"
      } px-3 py-3 rounded-2xl flex-[1] flex-row items-center`}
    >
      <View
        className="justify-center items-center p-4 mr-2 rounded-full"
        style={{
          backgroundColor: colors[`--color-${type}`] + "1A",
        }}
      >
        <Feather
          name={type === "income" ? "arrow-down-left" : "arrow-up-right"}
          size={22}
          color={colors[`--color-${type}`]}
        />
      </View>

      <View style={{ flex: 1 }}>
        <CustomText
          className={`text-base font-[Rounded-Bold] -mb-0.5`}
          style={{
            color: colors[`--color-${type}`],
          }}
          numberOfLines={1}
        >
          {formatCurrency(value, {
            spacing: true,
          })}
        </CustomText>

        <CustomText className="text-text-primary font-[Rounded-Bold] text-base">
          {type === "income" ? "Incomes" : "Expenses"}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default IncomesExpenses;
