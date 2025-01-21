import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  FadeIn,
  FadeOut,
  withSpring,
} from "react-native-reanimated";

import { AnimatedDigitTick } from "@/components/AnimatedRollingNumbers/AnimatedDigitTick";

interface AnimatedDigitProps {
  digit: string;
}

export const AnimatedDigit = ({ digit }: AnimatedDigitProps) => {
  const fontSize = 30;
  const digitHeight = fontSize * 1.5;

  const digitValue = Number(digit);

  if (isNaN(digitValue)) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <AnimatedDigitTick digit={digit} />
      </Animated.View>
    );
  }

  const translateY = useSharedValue(0);

  const digitStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withSpring(-digitHeight * digitValue);
  }, [digitValue]);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          height: digitHeight,
        },
        digitStyle,
      ]}
    >
      {Array.from({ length: 10 }, (_, index) => (
        <AnimatedDigitTick
          key={"AnimatedDigitTick" + index}
          digit={index.toString()}
        />
      ))}
    </Animated.View>
  );
};
