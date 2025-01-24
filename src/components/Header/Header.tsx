import { useState } from "react";
import { View } from "react-native";

import useThemeColors from "@/hooks/useThemeColors";

import { HeaderTitle } from "@/components/Header/HeaderTitle";
import { HeaderAction } from "@/components/Header/HeaderAction";
import { OverallBalance } from "@/components/Header/OverallBalance";

import { CustomDrawer } from "@/features/navigation/CustomDrawer";

import { MenuIcon } from "@/icons/MenuIcon";

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

  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View className="px-1 bg-header-background z-20">
      {drawer && (
        <CustomDrawer
          visible={drawerVisible}
          closeDrawer={() => setDrawerVisible(false)}
        />
      )}

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {drawer && (
            <HeaderAction onPress={() => setDrawerVisible(true)}>
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
