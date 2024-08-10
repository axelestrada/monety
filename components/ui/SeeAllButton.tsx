import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

const SeeAllButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} className="flex flex-row justify-between items-center">
      <Text className="font-[Rounded-Medium] text-main">See All</Text>
      <Feather name="chevron-right" color="#1B1D1C" />
    </TouchableOpacity>
  );
};

export default SeeAllButton;
