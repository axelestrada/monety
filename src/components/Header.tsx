import { TouchableOpacity, View } from "react-native";

import { CustomText } from "@/components/CustomText";
import { HeaderAction } from "@/components/HeaderAction";
import { OverallBalance } from "@/components/OverallBalance";
import useThemeColors from "@/hooks/useThemeColors";
import { IconMenu3 } from "@tabler/icons-react-native";

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
    <View className="py-2 px-2 bg-header-background z-20">
      <View className="flex-row justify-between items-center -mx-1 mb-2">
        <View className="flex-row items-center">
          <HeaderAction>
            <IconMenu3 size={24} color={colors["--color-accent"]} />
          </HeaderAction>

          <CustomText className="font-[Rounded-Bold] text-xl text-text-primary">
            {title || "Monety"}
          </CustomText>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance showDateRange={showDateRange} />}
    </View>
  );
}
