import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity } from "react-native";

const SeeAllButton = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="flex flex-row justify-between items-center"
      onPress={() => router.navigate("/transactions")}
    >
      <Feather
        size={24}
        name="chevron-right"
        color={colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"}
      />
    </TouchableOpacity>
  );
};

export default SeeAllButton;
