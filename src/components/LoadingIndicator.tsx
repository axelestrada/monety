import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import useThemeColors from "@/hooks/useThemeColors";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type LoadingIndicatorProps = {
  visible?: boolean;
  style?: ViewStyle;
};

export const LoadingIndicator = ({ visible, style }: LoadingIndicatorProps) => {
  const colors = useThemeColors();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, {
      duration: 150,
    }),
    pointerEvents: "none",
  }));

  return (
    <Animated.View
      className="flex-1 justify-center items-center"
      style={[StyleSheet.absoluteFillObject, style, animatedStyle]}
    >
      <ActivityIndicator size="large" color={colors["--color-accent"]} />
    </Animated.View>
  );
};
