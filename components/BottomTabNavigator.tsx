import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { View } from "react-native";
import IconButton from "./ui/IconButton";

import { useRouter, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";

const BottomTabNavigator = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { colorScheme } = useColorScheme();

  return (
    <View className="bg-white dark:bg-[#1A1A1A] rounded-t-3xl py-7 flex flex-row justify-evenly items-center" style={{
      elevation: 16,
      shadowColor: "#1b1d1c80"
    }}>
      <IconButton onPress={() => router.navigate("/")}>
        <Octicons
          name="home"
          size={18}
          color={
            pathname === "/"
              ? colorScheme === "dark"
                ? "#F5F5F5"
                : "#1B1D1C"
              : colorScheme === "dark"
              ? "#F5F5F580"
              : "#939496"
          }
        />
      </IconButton>

      <IconButton onPress={() => router.navigate("/accounts")}>
        <Ionicons
          name="wallet-outline"
          size={20}
          color={
            pathname === "/accounts"
              ? colorScheme === "dark"
                ? "#F5F5F5"
                : "#1B1D1C"
              : colorScheme === "dark"
              ? "#F5F5F580"
              : "#939496"
          }
        />
      </IconButton>

      <IconButton highlight onPress={() => router.navigate("/categories")}>
        <Octicons name="apps" size={20} color={colorScheme === "dark"
                ? "#1B1D1C"
                : "#FFFFFF"} />
      </IconButton>

      <IconButton onPress={() => router.navigate("/transactions")}>
        <Octicons
          name="rows"
          size={18}
          color={
            pathname === "/transactions"
              ? colorScheme === "dark"
                ? "#F5F5F5"
                : "#1B1D1C"
              : colorScheme === "dark"
              ? "#F5F5F580"
              : "#939496"
          }
        />
      </IconButton>

      <IconButton>
        <Feather
          name="bar-chart-2"
          size={20}
          color={
            pathname === "/statistics"
              ? colorScheme === "dark"
                ? "#F5F5F5"
                : "#1B1D1C"
              : colorScheme === "dark"
              ? "#F5F5F580"
              : "#939496"
          }
        />
      </IconButton>
    </View>
  );
};

export default BottomTabNavigator;
