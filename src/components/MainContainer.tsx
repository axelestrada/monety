import useThemeColors from "@/hooks/useThemeColors";

import { RefreshControl, ScrollView, View } from "react-native";
import { FloatingActionButton } from "@/components/FloatingActionButton/FloatingActionButton";
import { useRouter } from "expo-router";

interface MainContainerProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function MainContainer({
  children,
  onRefresh = () => {},
  refreshing = false,
}: MainContainerProps) {
  const colors = useThemeColors();

  const router = useRouter();

  return (
    <View className="flex-[1]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-main-background pb-4 px-3 relative"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors["--color-text-primary"]]}
            progressBackgroundColor={colors["--color-main-background"]}
          />
        }
      >
        {children}
      </ScrollView>

      <FloatingActionButton
        icon="plus"
        onPress={() => router.navigate("/transactions")}
      />
    </View>
  );
}
