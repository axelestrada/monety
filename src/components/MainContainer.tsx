import useThemeColors from "@/hooks/useThemeColors";
import { useState } from "react";

import { RefreshControl, ScrollView } from "react-native";

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-main-background my-4 px-3"
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
  );
}
