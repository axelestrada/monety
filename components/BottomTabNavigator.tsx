import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { View } from "react-native";
import IconButton from "./ui/IconButton";

import { useRouter, usePathname } from "expo-router";
import {styles} from "@/styles/shadow";

const BottomTabNavigator = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      className="bg-white rounded-t-3xl py-6 flex flex-row justify-evenly items-center"
      style={{
        elevation: 32,
        shadowColor: "##1B1D1C4D"
      }}
    >
      <IconButton onPress={() => router.navigate("/")}>
        <Octicons
          name="home"
          size={20}
          color={pathname === "/" ? "#1B1D1C" : "#939496"}
        />
      </IconButton>

      <IconButton>
        <Ionicons
          name="wallet-outline"
          size={22}
          color={pathname === "/accounts" ? "#1B1D1C" : "#939496"}
        />
      </IconButton>

      <IconButton highlight onPress={() => router.navigate("/categories")}>
        <Octicons name="apps" size={22} color="#FFFFFF" />
      </IconButton>

      <IconButton>
        <Octicons
          name="rows"
          size={20}
          color={pathname === "/transactions" ? "#1B1D1C" : "#939496"}
        />
      </IconButton>

      <IconButton>
        <Feather
          name="bar-chart-2"
          size={22}
          color={pathname === "/statistics" ? "#1B1D1C" : "#939496"}
        />
      </IconButton>
    </View>
  );
};

export default BottomTabNavigator;
