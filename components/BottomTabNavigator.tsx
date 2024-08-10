import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { View } from "react-native";
import IconButton from "./ui/IconButton";

const BottomTabNavigator = () => {
  return (
    <View className="bg-white rounded-t-3xl py-6 flex flex-row justify-evenly items-center">
      <IconButton>
        <Octicons name="home" size={20} color="#1B1D1C" />
      </IconButton>

      <IconButton>
        <Ionicons name="wallet-outline" size={22} color="#939496" />
      </IconButton>

      <IconButton primary>
        <Octicons name="apps" size={22} color="#FFFFFF" />
      </IconButton>

      <IconButton>
        <Octicons name="rows" size={20} color="#939496" />
      </IconButton>

      <IconButton>
        <Feather name="bar-chart-2" size={22} color="#939496" />
      </IconButton>
    </View>
  );
};

export default BottomTabNavigator;
