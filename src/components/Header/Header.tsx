import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import HeaderAction from "./HeaderAction";

import OverallBalance from "@/components/OverallBalance/OverallBalance";

interface Props {
  overallBalance?: boolean;
  timeRange?: boolean;
}

export default function Header({ overallBalance, timeRange }: Props) {
  const { toggleColorScheme } = useColorScheme();

  return (
    <View className="py-2 px-2 bg-white dark:bg-[#0D0D0D] z-20 shadow-2xl shadow-[#1b1d1c4d]">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <HeaderAction icon="menu" />

          <Text className="ml-1 font-[Rounded-Bold] text-xl text-main dark:text-[#f5f5f5]">
            Monety
          </Text>
        </View>

        <View className="flex-row items-center">
          <HeaderAction icon="bell" badge />
          <HeaderAction icon="search" onPress={toggleColorScheme} />
        </View>
      </View>

      {overallBalance && <OverallBalance timeRange={timeRange} />}
    </View>
  );
}
