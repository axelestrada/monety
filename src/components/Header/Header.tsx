import { Text, View } from "react-native";

import HeaderAction from "./HeaderAction";

import { OverallBalance } from "@/components";

interface Props {
  overallBalance?: boolean;
  timeRange?: boolean;
}

export default function Header({ overallBalance, timeRange }: Props) {
  return (
    <View className="py-2 px-2 bg-white z-20 shadow-2xl shadow-[#1b1d1c4d]">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <HeaderAction icon="menu" />

          <Text className="ml-1 font-[Rounded-Bold] text-xl text-main dark:text-[#f5f5f5]">
            Monety
          </Text>
        </View>

        <View className="flex-row items-center">
          <HeaderAction icon="bell" badge />
          <HeaderAction icon="search" />
        </View>
      </View>

      {overallBalance && <OverallBalance timeRange={timeRange} />}
    </View>
  );
}
