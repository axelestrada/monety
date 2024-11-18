import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useColorScheme } from "nativewind";

import HeaderAction from "./HeaderAction";

import OverallBalance from "@/components/OverallBalance/OverallBalance";


interface Props {
  overallBalance?: boolean;
  dateRange?: boolean;
}

export default function Header({ overallBalance, dateRange }: Props) {
  const navigation = useNavigation();

  const { toggleColorScheme } = useColorScheme();

   return (
    <View className="py-2 px-2 bg-white dark:bg-[#0D0D0D] z-20 shadow-2xl shadow-[#1b1d1c4d]">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <HeaderAction icon="menu" onPress={() => navigation.openDrawer()} />

          <Text className="ml-1 font-[Rounded-Bold] text-xl text-main dark:text-[#f5f5f5]">
            Hi, Axel
          </Text>
        </View>

        <View className="flex-row items-center">
          <HeaderAction icon="bell" badge />
          <HeaderAction icon="search" onPress={toggleColorScheme} />
        </View>
      </View>

      {overallBalance && <OverallBalance dateRange={dateRange} />}
    </View>
  );
}
