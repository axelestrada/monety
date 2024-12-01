import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";

export default function useLoadFonts() {
  const [loaded, error] = useFonts({
    "Rounded-Regular": require("../assets/fonts/Rounded-Regular.ttf"),
    "Rounded-Medium": require("../assets/fonts/Rounded-Medium.ttf"),
    "Rounded-Bold": require("../assets/fonts/Rounded-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return [error, loaded];
}
