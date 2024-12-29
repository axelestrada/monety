import { View } from "react-native";
import { BottomNavigationItem } from "./BottomNavigationItem";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { HomeOutline } from "@/assets/icons/HomeOutline";
import useThemeColors from "@/hooks/useThemeColors";
import { HomeFill } from "@/assets/icons/HomeFill";
import { RowsOutline } from "@/assets/icons/RowsOutline";
import { BarChartOutline } from "@/assets/icons/BarChartOutline";

export const BottomNavigationBar = () => {
  const colors = useThemeColors();

  return (
    <View className="bg-card-background px-2 py-3.5 flex-row items-stretch">
      <BottomNavigationItem
        label="Home"
        pathname="/"
        icon={({ isActive }) =>
          isActive ? (
            <HomeFill fill={colors["--color-icon-primary"]} />
          ) : (
            <HomeOutline fill={colors["--color-icon-secondary"]} />
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
            color={colors[`--color-icon-${isActive ? "primary" : "secondary"}`]}
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
            color={colors[`--color-icon-${isActive ? "primary" : "secondary"}`]}
          />
        )}
      />

      <BottomNavigationItem
        label="Transactions"
        pathname="/transactions"
        icon={({ isActive }) => (
          <RowsOutline
            fill={isActive ? colors["--color-icon-secondary"] : "none"}
            stroke={
              colors[`--color-icon-${isActive ? "primary" : "secondary"}`]
            }
          />
        )}
      />

      <BottomNavigationItem
        label="Statistics"
        pathname="/statistics"
        icon={({ isActive }) => (
          <BarChartOutline
            fill={isActive ? colors["--color-icon-secondary"] : "none"}
            stroke={
              colors[`--color-icon-${isActive ? "primary" : "secondary"}`]
            }
          />
        )}
      />
    </View>
  );
};
