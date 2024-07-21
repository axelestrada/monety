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
        style,
        activeBackground && pressed
          ? {
              backgroundColor:activeBackground,
            }
          : {},
      ]}
      onPress={onPress}
    >
      {children}
    </PressableRaw>
  );
}

export default Pressable;
