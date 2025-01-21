import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { CustomText } from "@/components/CustomText";
import { useEffect } from "react";

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
        <CustomText
          className="font-[Rounded-Bold] text-text-primary"
          style={{
            fontSize: fontSize,
            lineHeight: digitHeight,
          }}
        >
          {digit}
        </CustomText>
      </Animated.View>
    );
  }

  const translateY = useSharedValue(0);

  const digitStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withTiming(-digitHeight * digitValue);
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
        <CustomText
          key={"AnimatedDigitTick" + index}
          className="font-[Rounded-Bold] text-text-primary"
          style={{
            fontVariant: ["tabular-nums"],
            fontSize: fontSize,
            lineHeight: digitHeight,
          }}
        >
          {index}
        </CustomText>
      ))}
    </Animated.View>
  );
};
