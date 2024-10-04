import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

const NoTransactions = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="justify-center items-center rounded-md grow my-4">
      <FontAwesome6
        name="not-equal"
        color={colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"}
        size={48}
      />
      <Text className="font-[Rounded-Medium] text-main dark:text-[#F5F5F5] mt-2">
        No transactions found
      </Text>
    </View>
  );
};

export default NoTransactions;
