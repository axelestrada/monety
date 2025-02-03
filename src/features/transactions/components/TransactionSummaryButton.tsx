import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";
import formatCurrency from "@/components/Header/utils/formatCurrency";
import useThemeColors from "@/hooks/useThemeColors";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

interface TransactionSummaryButtonProps {
  type: "income" | "expense";
  value: number;
  onPress?: () => void;
  active: boolean;
  loading?: boolean;
}

export const TransactionSummaryButton = ({
  active,
  type,
  value = 0,
  loading = false,
  onPress,
}: TransactionSummaryButtonProps) => {
  const colors = useThemeColors();

  const valueStyle = useAnimatedStyle(() => ({
    opacity: withTiming(loading ? 0 : 1, { duration: 200 }),
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${
        active ? "bg-card-background" : "bg-none"
      } px-3 py-3 rounded-2xl flex-[1] flex-row items-center`}
    >
      <View
        className="justify-center items-center mr-2"
        style={{
          backgroundColor: colors[`--color-${type}`] + "26",
          borderRadius: 16,
          width: 50,
          height: 50,
        }}
      >
        <Feather
          name={type === "income" ? "arrow-down-left" : "arrow-up-right"}
          size={22}
          color={colors[`--color-${type}`]}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Animated.View style={valueStyle}>
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
        </Animated.View>

        <CustomText className="text-text-primary font-[Rounded-Bold] text-base">
          {type === "income" ? "Incomes" : "Expenses"}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};
