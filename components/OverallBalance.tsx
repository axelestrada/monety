import { Text, View } from "react-native";

interface Props {
  compressed?: boolean;
}

const OverallBalance = ({compressed} : Props) => {
  return (
    <View className={`justify-center items-center ${compressed ? "py-1" : "py-4"}`}>
      <Text className="text-[#1b1d1c80]">Overall balance</Text>
      <Text className="text-main font-[Rounded-Bold] text-4.5xl">
        L 4,125.83
      </Text>
    </View>
  );
};

export default OverallBalance;
