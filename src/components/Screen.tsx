import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import useThemeColors from "@/hooks/useThemeColors";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";

interface ScreenProps {
  children: React.ReactNode;
}
export default function Screen({ children }: ScreenProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-main-background">
      <StatusBar backgroundColor={colors["--color-header-background"]} />

      {children}

      <BottomNavigationBar />
    </SafeAreaView>
  );
}
