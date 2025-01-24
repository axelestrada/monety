import moment from "moment";

import { View } from "react-native";

import { CustomText } from "@/components/CustomText";

export const DrawerHeader = () => {
  return (
    <View className="px-3 py-6">
      <CustomText className="text-accent text-xl font-[Rounded-Medium]">
        MONETY
      </CustomText>

      <CustomText className="text-text-primary text-sm font-[Rounded-Medium]">
        {moment().format("dddd")}
      </CustomText>

      <CustomText className="text-text-primary-75 text-s font-[Rounded-Medium]">
        {moment().format("LL")}
      </CustomText>
    </View>
  );
};
