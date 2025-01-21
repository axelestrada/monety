import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AnimatedDigitTick } from "@/components/AnimatedRollingNumbers/AnimatedDigitTick";

interface AnimatedSignProps {
  sign: string;
  visible: boolean;
}

export const AnimatedSign = ({ sign, visible }: AnimatedSignProps) => {
  const signHeight = 45;
  const signs = ["+", "-"];

  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      if (sign === "+") translateY.value = withSpring(0);
      if (sign === "-") translateY.value = withSpring(-signHeight);
    } else {
      translateY.value = withSpring(
        translateY.value === 0 ? signHeight : -signHeight * 2
      );
    }
  }, [sign, visible]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: withTiming(visible ? 1 : 0),
    position: "absolute",
    left: 24,
    top: 0,
  }));

  return (
    <Animated.View style={style}>
      {signs.map((sign, index) => (
        <AnimatedDigitTick key={"AnimatedSign" + index} digit={sign} />
      ))}
    </Animated.View>
  );
};
