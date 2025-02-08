import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigationBar } from "@/features/navigation/BottomNavigationBar/BottomNavigationBar";
import { View } from "react-native";

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
  return (
    <SafeAreaView className="flex-[1] bg-main-background relative">
      <StatusBar translucent backgroundColor="transparent" />

      {children}
    </SafeAreaView>
  );
}
