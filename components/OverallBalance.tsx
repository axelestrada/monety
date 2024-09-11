import { ReactElement } from "react";
import { Text, View } from "react-native";

interface Props {
  children?: ReactElement;
}

const OverallBalance = ({ children }: Props) => {
  return (
    <View className={`justify-center items-center p-2 pb-4`}>
      <Text className="text-[#1b1d1cbf] text-xs">Overall balance</Text>
      <Text className="text-main font-[Rounded-Bold] text-[34px]">
        L 4,125.83
      </Text>

      {children}
    </View>
  );
};

export default OverallBalance;
