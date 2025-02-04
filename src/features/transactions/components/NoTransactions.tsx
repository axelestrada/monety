import { View } from "react-native";
import { Octicons } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";

import useThemeColors from "@/hooks/useThemeColors";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const NoTransactions = () => {
  const colors = useThemeColors();

  return (
    <Animated.View
      className="items-center justify-center flex-1"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Octicons
        size={24}
        name="rows"
        color={colors["--color-text-secondary"]}
      />

      <CustomText className="text-text-secondary text-sm mt-2 font-[Rounded-Medium]">
        No transactions yet
      </CustomText>
    </Animated.View>
  );
};
