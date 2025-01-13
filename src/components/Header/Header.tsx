import { View } from "react-native";

import { HeaderAction } from "@/components/Header/HeaderAction";
import { OverallBalance } from "@/components/Header/OverallBalance";
import useThemeColors from "@/hooks/useThemeColors";
import { HeaderTitle } from "@/components/Header/HeaderTitle";
import { MenuIcon } from "@/icons/MenuIcon";

interface HeaderProps {
  overallBalance?: boolean;
  showDateRange?: boolean;
  children?: React.ReactNode;
  title?: string;
}

export default function Header({
  overallBalance,
  showDateRange,
  children,
  title,
}: HeaderProps) {
  const colors = useThemeColors();

  return (
    <View className="px-1 bg-header-background z-20">
      <View className="flex-row justify-between items-center" >
        <View className="flex-row items-center">
          <HeaderAction>
            <MenuIcon stroke={colors["--color-accent"]} />
          </HeaderAction>

          <HeaderTitle>{title}</HeaderTitle>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance showDateRange={showDateRange} />}
    </View>
  );
}
