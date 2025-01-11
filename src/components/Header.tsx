import { View } from "react-native";

import { HeaderAction } from "@/components/HeaderAction";
import { OverallBalance } from "@/components/OverallBalance";
import useThemeColors from "@/hooks/useThemeColors";
import { IconMenu3 } from "@tabler/icons-react-native";
import { HeaderTitle } from "@/components/HeaderTitle";

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
            <IconMenu3 size={24} color={colors["--color-accent"]} />
          </HeaderAction>

          <HeaderTitle>{title}</HeaderTitle>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance showDateRange={showDateRange} />}
    </View>
  );
}
