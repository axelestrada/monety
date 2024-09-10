import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const NoTransactions = () => {
  return (
    <View className="justify-center items-center rounded-md grow my-4">
      <FontAwesome6 name="not-equal" color="#1B1D1C" size={48}/>
      <Text className="font-[Rounded-Medium] text-main mt-2">No transactions found</Text>
    </View>
  );
};

export default NoTransactions;
