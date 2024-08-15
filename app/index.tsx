import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useCallback, useState } from "react";

import BackgroundGradient from "@/components/ui/BackgroundGradient";
import Header from "@/components/Header";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import OverallBalance from "@/components/OverallBalance";
import AnalyticsChart from "@/components/AnalyticsChart";
import CashFlowItem from "@/components/CashFlowItem";
import TransactionsList from "@/components/TransactionsList";
import IconButton from "@/components/ui/IconButton";
import { Octicons } from "@expo/vector-icons";

export default function Index() {
  const [analyticsType, setAnalyticsType] = useState<"incomes" | "expenses">(
    "incomes"
  );

  // #region Load Fonts
  const [fontsLoaded, fontError] = useFonts({
    "Rounded-Regular": require("../assets/fonts/Rounded-Regular.ttf"),
    "Rounded-Medium": require("../assets/fonts/Rounded-Medium.ttf"),
    "Rounded-Bold": require("../assets/fonts/Rounded-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  //#endregion

  return (
    <SafeAreaView className="flex flex-1" onLayout={onLayoutRootView}>
      <BackgroundGradient />

      <Header title="Home">
        <IconButton>
          <Octicons name="gear" size={20} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView className="mt-4 -mb-4" contentContainerStyle={{ flexGrow: 1 }}>
        <AnalyticsChart type={analyticsType} />

        <View className="flex flex-row mt-4 mx-2">
          <CashFlowItem
            type="incomes"
            value={1250}
            onPress={() => setAnalyticsType("incomes")}
          />
          <CashFlowItem
            type="expenses"
            value={570}
            onPress={() => setAnalyticsType("expenses")}
          />
        </View>

        <TransactionsList />
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
}
