import Animated, {
  LinearTransition,
  FadeOut,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSpring,
} from "react-native-reanimated";

import { AnimatedDigit } from "@/components/AnimatedRollingNumbers/AnimatedDigit";
import { AnimatedSign } from "@/components/AnimatedRollingNumbers/AnimatedSign";

import { useEffect, useState } from "react";

interface AnimatedRollingNumbersProps {
  value: number;
  showCurrency?: boolean;
  showPlusSign?: boolean;
  showMinusSign?: boolean;
  locale?: string;
  currency?: string;
  spacing?: boolean;
}

export const AnimatedRollingNumbers = ({
  value,
  showPlusSign = false,
  showMinusSign = false,
  showCurrency = false,
  locale = "en-US",
  currency = "$",
  spacing = false,
}: AnimatedRollingNumbersProps) => {
  const [sign, setSign] = useState("");

  let formattedNumber = Intl.NumberFormat(locale).format(value);

  const decimals = formattedNumber.split(".")[1];
  if (decimals?.length === 1) formattedNumber += "0";

  const digits = formattedNumber.split("");

  useEffect(() => {
    if (showPlusSign && value > 0) return setSign("+");
    if (showMinusSign && value < 0) return setSign("-");

    setSign("");
  }, [showPlusSign, showMinusSign, value]);

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingLeft: withTiming(sign !== "" ? 45 : 32),
    paddingRight: withTiming(sign !== "" ? 30 : 32),
  }));

  return (
    <Animated.View
      layout={LinearTransition}
      style={animatedViewStyle}
      className="flex-row overflow-hidden"
    >
      <AnimatedSign sign={sign} visible={sign !== ""} />

      {showCurrency && (
        <AnimatedDigit
          key="AnimatedCurrency"
          digit={currency + (spacing ? " " : "")}
        />
      )}
      {digits
        .filter((digit) => digit !== "+" && digit !== "-")
        .map((digit, index) => (
          <AnimatedDigit key={"AnimatedDigit" + index} digit={digit} />
        ))}
    </Animated.View>
  );
};
