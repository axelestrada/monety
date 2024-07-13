import { Colors } from "@/constants/Colors";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useCallback } from "react";

import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "./Logo";
import LastSynchronization from "./LastSynchronization";

function Drawer(props: DrawerContentComponentProps) {
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
      <View>
        <Logo />
        <LastSynchronization />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: Colors.light.menuBackground,
  },
});

export default Drawer;
