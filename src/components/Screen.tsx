import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigationBar } from "@/features/navigation/BottomNavigationBar";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { duration } from "moment";
import { Dimensions, View } from "react-native";

interface ScreenProps {
  children: React.ReactNode;
  pathname?: string;
  showBottomNavigationBar?: boolean;
}

export default function Screen({
  children,
  pathname,
  showBottomNavigationBar,
}: ScreenProps) {
  const currentPathname = usePathname();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(pathname === currentPathname ? 1 : 0),
  }));

  return (
    <View className="flex-1 bg-main-background">
      <SafeAreaView className="flex-[1] bg-main-background relative">
        <StatusBar translucent backgroundColor="transparent" />

        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {children}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
