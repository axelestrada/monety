import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";

import useThemeColors from "@/hooks/useThemeColors";
import Animated, {
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

interface ErrorMessageProps {
  children?: string;
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
  const colors = useThemeColors();

  return (
    <Animated.View
      className="items-center justify-center flex-1"
      entering={FadeIn}
      exiting={FadeOut}
      style={StyleSheet.absoluteFillObject}
    >
      <View
        className="rounded-full p-2"
        style={{ backgroundColor: colors["--color-error"] + "1A" }}
      >
        <Ionicons name="alert" size={24} color={colors["--color-error"]} />
      </View>

      <CustomText className="text-text-secondary text-sm mt-2 font-[Rounded-Medium]">
        {children || "An unexpected error occurred."}
      </CustomText>
    </Animated.View>
  );
};
