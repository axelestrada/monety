import { PressableProps, StyleProp, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { Pressable as PressableRaw } from "react-native";

function Pressable({
  children,
  style,
  activeBackground,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  activeBackground?: string;
  onPress?: () => void;
}) {
  return (
    <PressableRaw
      style={({ pressed }) => [
        activeBackground
          ? {
              backgroundColor: pressed ? activeBackground : "transparent",
            }
          : {},
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </PressableRaw>
  );
}

export default Pressable;
