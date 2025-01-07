import { useEffect, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HeaderTitleProps {
  children?: string;
}

export const HeaderTitle = ({ children }: HeaderTitleProps) => {
  const [text, setText] = useState(children);

  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (children !== text) {
      opacity.value = withTiming(0, {
        duration: 100,
      });
      translateY.value = withTiming(
        10,
        {
          duration: 100,
        },
        () => {
          runOnJS(setText)(children);
          translateY.value = -10;
          opacity.value = withTiming(1, {
            duration: 300,
          });
          translateY.value = withTiming(0, {
            duration: 300,
          });
        }
      );
    }
  }, [children]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text
      allowFontScaling={false}
      className="font-[Rounded-Bold] text-xl text-text-primary"
      style={animatedStyle}
    >
      {text}
    </Animated.Text>
  );
};
