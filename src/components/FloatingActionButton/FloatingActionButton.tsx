import { Pressable, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import useThemeColors from "@/hooks/useThemeColors";
import { useColorScheme } from "nativewind";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useCallback } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface FloatingActionButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}

export const FloatingActionButton = ({
  icon,
  onPress = () => {},
}: FloatingActionButtonProps) => {
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const pressed = useSharedValue<boolean>(false);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
      runOnJS(onPress)()
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 1.2 : 1, {
      duration: 150
    }) }],
  }))

  const handlePress = useCallback(() => {

  }, [])

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        className="w-16 h-16 absolute bottom-3 right-3 z-20"
        style={
          [colorScheme === "light"
            ? {
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                elevation: 5,
                shadowColor: colors["--color-shadow-75"],
              }
            : {}, animatedStyle]
        }
      >
        <LinearGradient
          colors={[
            colors["--color-accent-gradient-start"],
            colors["--color-accent-gradient-end"],
          ]}
          className="flex-1 justify-center items-center"
          style={{ borderRadius: 20 }}
        >
          <Feather name={icon} size={24} color="white" />
        </LinearGradient>
    </Animated.View>
    </GestureDetector>
  );
};
