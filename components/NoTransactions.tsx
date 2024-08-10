import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const NoTransactions = () => {
  return (
    <View className="justify-center items-center rounded-md grow">
      <MaterialCommunityIcons name="layers-off-outline" color="#1B1D1C" size={32}/>
      <Text className="font-[Rounded-Medium] text-main mt-1">No transactions found</Text>
    </View>
  );
};

export default NoTransactions;
