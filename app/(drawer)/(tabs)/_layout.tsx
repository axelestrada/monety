import { SplashScreen, Stack, Tabs, useNavigation } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "@/store";
import { Provider } from "react-redux";

import "@/global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

import { PortalProvider } from "@gorhom/portal";

import useLoadFonts from "@/hooks/useLoadFonts";
import { Button, View } from "react-native";
import Header from "@/components/Header/Header";
import { CustomText } from "@/components/CustomText";
import { HeaderTitle } from "@/components/Header/HeaderTitle";

import Constants from "expo-constants";
import { BottomNavigationBar } from "@/features/navigation/BottomNavigationBar";
import { PremiumBannerProvider } from "@/components/PremiumBanner/PremiumBannerContext";

export default function Layout() {
  return (
    <PremiumBannerProvider>
      <Tabs
        tabBar={() => <BottomNavigationBar />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />

        <Tabs.Screen name="accounts" />

        <Tabs.Screen name="categories" />

        <Tabs.Screen name="transactions" />

        <Tabs.Screen name="statistics" />
      </Tabs>
    </PremiumBannerProvider>
  );
}
