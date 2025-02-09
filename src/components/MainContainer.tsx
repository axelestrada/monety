import useThemeColors from "@/hooks/useThemeColors";

import { RefreshControl, ScrollView, View } from "react-native";
import { FloatingActionButton } from "@/components/FloatingActionButton/FloatingActionButton";
import { useRouter } from "expo-router";
import { PremiumBanner } from "./PremiumBanner/PremiumBanner";

interface MainContainerProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function MainContainer({
  children,
}: MainContainerProps) {
  const colors = useThemeColors();

  const router = useRouter();

  return (
    <View className="flex-[1]">
      {children}

      <PremiumBanner />

      <FloatingActionButton
        icon="plus"
        onPress={() => router.navigate("/transactions")}
      />
    </View>
  );
}
