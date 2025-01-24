import { Portal } from "@gorhom/portal";
import { useCallback, useEffect } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  Dimensions,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CustomModalProps {
  children: React.ReactNode;
  isVisible: boolean;
  onRequestClose?: () => void;
  priority?: number;
  position?: "bottom" | "center" | "left";
  animationType?: "slide-from-bottom" | "slide-from-left";
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const CustomModal = ({
  children,
  isVisible,
  onRequestClose,
  priority = 1,
  position = "center",
  animationType = "slide-from-bottom",
}: CustomModalProps) => {
  const zIndex = priority * 1000;

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const opacity = useSharedValue(0);

  const animations = {
    "slide-from-bottom": {
      in: () => {
        translateX.value = 0;
        opacity.value = withTiming(1, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      },
      out: () => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(screenHeight + 50, { duration: 200 });
      },
    },
    "slide-from-left": {
      in: () => {
        translateY.value = 0;
        opacity.value = withTiming(1, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
      },
      out: () => {
        opacity.value = withTiming(0, { duration: 200 });
        translateX.value = withTiming(-screenWidth - 50, { duration: 200 });
      },
    },
  };

  const animateIn = useCallback(() => {
    animations[animationType].in();
  }, [animationType]);

  const animateOut = useCallback(() => {
    animations[animationType].out();
  }, [animationType]);

  useEffect(() => {
    if (isVisible) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isVisible, animateIn, animateOut]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isVisible) {
          if (onRequestClose) {
            onRequestClose();
          }
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isVisible, onRequestClose]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const positionStyle = {
    bottom: "justify-end",
    center: "justify-center items-center",
    left: "justify-start items-start",
  };

  return (
    <Portal>
      <Animated.View
        style={[{ ...StyleSheet.absoluteFillObject, zIndex }, animatedStyle]}
      >
        <TouchableOpacity
          className={`bg-modal-background ${positionStyle[position]}`}
          onPress={onRequestClose}
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </TouchableOpacity>
      </Animated.View>
    </Portal>
  );
};
