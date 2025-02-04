import { View } from "react-native";
import { BottomNavigationItem } from "@/features/navigation/BottomNavigationBar/BottomNavigationItem";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { HomeOutline } from "@/icons/HomeOutline";
import useThemeColors from "@/hooks/useThemeColors";
import { HomeFill } from "@/icons/HomeFill";
import { RowsOutline } from "@/icons/RowsOutline";
import { BarChartOutline } from "@/icons/BarChartOutline";

export const BottomNavigationBar = () => {
  const colors = useThemeColors();

  return (
    <View className="bg-card-background px-2 py-3.5 flex-row items-stretch">
      <BottomNavigationItem
        label="Home"
        pathname="/"
        icon={({ isActive }) =>
          isActive ? (
            <HomeFill fill={colors["--color-navbar-item-active"]} />
          ) : (
            <HomeOutline fill={colors["--color-navbar-item"]} />
          )
        }
      />

      <BottomNavigationItem
        label="Accounts"
        pathname="/accounts"
        icon={({ isActive }) => (
          <Ionicons
            name={isActive ? "wallet" : "wallet-outline"}
            size={22}
            color={colors[`--color-navbar-item${isActive ? "-active" : ""}`]}
          />
        )}
      />

      <BottomNavigationItem
        label="Categories"
        pathname="/categories"
        icon={({ isActive }) => (
          <Ionicons
            name={isActive ? "grid" : "grid-outline"}
            size={22}
            color={colors[`--color-navbar-item${isActive ? "-active" : ""}`]}
          />
        )}
      />

      <BottomNavigationItem
        label="Transactions"
        pathname="/transactions"
        icon={({ isActive }) => (
          <RowsOutline
            fill={isActive ? colors["--color-navbar-item-active"] : "none"}
            stroke={
              colors[`--color-navbar-item${isActive ? "-active" : ""}`]
            }
          />
        )}
      />

      <BottomNavigationItem
        label="Statistics"
        pathname="/statistics"
        icon={({ isActive }) => (
          <BarChartOutline
            fill={isActive ? colors["--color-navbar-item-active"] : "none"}
            stroke={
              colors[`--color-navbar-item${isActive ? "-active" : ""}`]
            }
          />
        )}
      />
    </View>
  );
};
