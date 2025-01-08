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
  position?: "bottom" | "center";
}

const screenHeight = Dimensions.get("window").height;

export const CustomModal = ({
  children,
  isVisible,
  onRequestClose,
  priority = 1,
  position = "center",
}: CustomModalProps) => {
  const zIndex = priority * 1000;

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animateIn = useCallback(() => {
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
  }, [opacity, translateY]);

  const animateOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(screenHeight + 50, { duration: 200 });
  }, [opacity, translateY]);

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
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Portal>
      <Animated.View
        style={[{ ...StyleSheet.absoluteFillObject, zIndex }, animatedStyle]}
      >
        <TouchableOpacity
          className={`bg-modal-background ${
            position === "center"
              ? "justify-center items-center"
              : "justify-end"
          }`}
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
