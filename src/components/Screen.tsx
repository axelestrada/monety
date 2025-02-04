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

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (pathname) {
      if (currentPathname === pathname) {
        opacity.value = withTiming(1);
      } else {
        opacity.value = withTiming(0);
      }
    }
  }, [currentPathname]);

  return (
    <View className="flex-1 bg-main-background">
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <SafeAreaView className="flex-[1] bg-main-background relative">
          <StatusBar translucent backgroundColor="transparent" />

          {children}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
