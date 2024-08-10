import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

const SeeAllButton = () => {
  return (
    <View>
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[Rounded-Medium] text-main">See All</Text>
        <Feather name="chevron-right" color="#1B1D1C" />
      </View>
    </View>
  );
};

export default SeeAllButton;
