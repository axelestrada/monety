import { View } from "react-native";

import { CustomText } from "@/components/CustomText";
import { HeaderAction } from "@/components/HeaderAction";
import { OverallBalance } from "@/components/OverallBalance";
import useThemeColors from "@/hooks/useThemeColors";

interface HeaderProps {
  overallBalance?: boolean;
  dateRange?: boolean;
  children?: React.ReactNode;
  title?: string;
}

export default function Header({
  overallBalance,
  dateRange,
  children,
  title,
}: HeaderProps) {
  const colors = useThemeColors();

  return (
    <View className="py-2 px-2 bg-header-background z-20">
      <View className="flex-row justify-between items-center -mx-0.5 mb-2">
        <View className="flex-row items-center">
          <HeaderAction icon="menu" color={colors["--color-accent"]} />

          <CustomText className="font-[Rounded-Bold] text-xl text-text-primary">
            {title || "Monety"}
          </CustomText>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance dateRange={dateRange} />}
    </View>
  );
}
