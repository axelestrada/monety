import useThemeColors from "@/hooks/useThemeColors";

import { RefreshControl, ScrollView, View } from "react-native";
import { FloatingActionButton } from "@/components/FloatingActionButton/FloatingActionButton";

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
        onPress={() => console.log("Add new transaction")}
      />
    </View>
  );
}
