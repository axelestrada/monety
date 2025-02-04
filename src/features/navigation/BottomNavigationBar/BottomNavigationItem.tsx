import { TouchableOpacity, View } from "react-native";
import { Href, usePathname, useRouter } from "expo-router";

import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";
import Animated, {
  FadeIn,
  FadeOut,
  StretchInX,
  StretchInY,
  StretchOutX,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

interface BottomNavigationItemProps {
  label: string;
  pathname: Href;
  icon: ({ isActive }: { isActive: boolean }) => React.ReactNode;
}

export const BottomNavigationItem = ({
  icon,
  label,
  pathname: itemPathname,
}: BottomNavigationItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const colors = useThemeColors();

  const isActive = pathname === itemPathname;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0),
    transform: [
      {
        scaleX: withTiming(isActive ? 1 : 0),
      },
    ],
  }));

  return (
    <TouchableOpacity
      className="items-center flex-[1] justify-between mx-1"
      onPress={() => router.navigate(itemPathname)}
    >
      <View
        className={`py-1.5 mb-1 ${
          itemPathname === "/transactions" ? "py-2" : ""
        }`}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              pointerEvents: "none",
              top: 0,
              bottom: 0,
              left: -24,
              right: -24,
              backgroundColor: colors["--color-accent-background"],
              borderRadius: 100,
            },
            animatedStyle,
          ]}
        />
        {icon({ isActive })}
      </View>

      <CustomText
        numberOfLines={1}
        className={`text-s font-[Rounded-Medium]`}
        style={{
          color: colors[`--color-navbar-item${isActive ? "-active" : ""}`],
        }}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};
