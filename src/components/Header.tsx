import { View } from "react-native";

import CustomText from "@/components/CustomText";
import HeaderAction from "@/components/HeaderAction";
import OverallBalance from "@/components/OverallBalance";

interface HeaderProps {
  overallBalance?: boolean;
  dateRange?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  overallBalance,
  dateRange,
  children,
}: HeaderProps) {
  return (
    <View className="py-2 px-3 bg-header-background z-20 shadow-2xl shadow-shadow-30 dark:shadow-none">
      <View className="flex-row justify-between items-center mb-2 -mx-2">
        <View className="flex-row items-center">
          <HeaderAction icon="menu" />

          <CustomText className="ml-1 font-[Rounded-Bold] text-xl text-text-primary">
            Monety
          </CustomText>
        </View>

        <View className="flex-row items-center">{children}</View>
      </View>

      {overallBalance && <OverallBalance dateRange={dateRange} />}
    </View>
  );
}
