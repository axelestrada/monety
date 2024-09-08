import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const SeeAllButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="flex flex-row justify-between items-center"
      onPress={() => router.navigate("/transactions")}
    >
      <Text className="font-[Rounded-Medium] text-main text-lg">See All</Text>
      <Feather name="chevron-right" color="#1B1D1C" />
    </TouchableOpacity>
  );
};

export default SeeAllButton;
