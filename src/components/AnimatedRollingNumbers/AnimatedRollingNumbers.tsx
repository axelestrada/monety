import Animated, {
  LinearTransition,
  FadeOut,
  FadeIn,
} from "react-native-reanimated";

import { AnimatedDigit } from "@/components/AnimatedRollingNumbers/AnimatedDigit";

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
  let formattedNumber = Intl.NumberFormat(locale).format(value);

  const decimals = formattedNumber.split(".")[1];
  if (decimals?.length === 1) formattedNumber += "0";

  const digits = formattedNumber.split("");

  const isNegative = value < 0;

  return (
    <Animated.View
      layout={LinearTransition}
      exiting={FadeOut}
      entering={FadeIn}
      className="flex-row overflow-hidden"
    >
      {showPlusSign && !isNegative && (
        <AnimatedDigit key="AnimatedPlusSign" digit="+" />
      )}

      {showMinusSign && isNegative && (
        <AnimatedDigit key="AnimatedMinusSign" digit="-" />
      )}

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
