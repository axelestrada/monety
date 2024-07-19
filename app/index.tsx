import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { Link, SplashScreen } from "expo-router";
import { useCallback } from "react";
import TimeInterval from "@/components/TimeInterval";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  // #region Load Fonts
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
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
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <Header />
      <TimeInterval />

      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.mainBackground,
  },
});
