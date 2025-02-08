import { SplashScreen, Stack, Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Drawer from "expo-router/drawer";

import store from "@/store";
import { Provider } from "react-redux";

import "@/global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

import { PortalProvider } from "@gorhom/portal";

import useLoadFonts from "@/hooks/useLoadFonts";
import { Button, View } from "react-native";
import { HeaderTitle } from "@/components/Header/HeaderTitle";

import { HeaderAction } from "@/components/Header/HeaderAction";
import { MenuIcon } from "@/icons/MenuIcon";
import useThemeColors from "@/hooks/useThemeColors";
import { CustomDrawer } from "@/features/navigation/CustomDrawer";

import Constants from "expo-constants";

export default function Layout() {
  const colors = useThemeColors();

  return (
    <Drawer
      drawerContent={(props) => {
        return <CustomDrawer />;
      }}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "80%",
          backgroundColor: "transparent",
          paddingTop: Constants.statusBarHeight,
        },
        drawerHideStatusBarOnOpen: false,
      }}
    ></Drawer>
  );
}
