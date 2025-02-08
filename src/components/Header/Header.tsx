import { useState } from "react";
import { View } from "react-native";

import useThemeColors from "@/hooks/useThemeColors";

import { HeaderTitle } from "@/components/Header/HeaderTitle";
import { HeaderAction } from "@/components/Header/HeaderAction";
import { OverallBalance } from "@/components/Header/OverallBalance";

import { CustomDrawer } from "@/features/navigation/CustomDrawer";

import { MenuIcon } from "@/icons/MenuIcon";
import { useNavigation } from "expo-router";

import { DrawerActions } from "@react-navigation/native";

interface HeaderProps {
  overallBalance?: boolean;
  showDateRange?: boolean;
  children?: React.ReactNode;
  title?: string;
  drawer?: boolean;
}

export default function Header({
  drawer,
  overallBalance,
  showDateRange,
  children,
  title,
}: HeaderProps) {
  const colors = useThemeColors();
  const navigation = useNavigation();

  return (
    <View className="px-1 bg-header-background z-20">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {drawer && (
            <HeaderAction
              onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
            >
              <MenuIcon stroke={colors["--color-accent"]} />
            </HeaderAction>
          )}

          <HeaderTitle>{title}</HeaderTitle>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance showDateRange={showDateRange} />}
    </View>
  );
}
