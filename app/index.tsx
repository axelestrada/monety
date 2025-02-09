import useLoadFonts from "@/hooks/useLoadFonts";
import useThemeColors from "@/hooks/useThemeColors";
import { useFonts } from "expo-font";
import { Link, SplashScreen, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Button, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const [error, loaded] = useLoadFonts()

  const colors = useThemeColors();
  const router = useRouter();

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-main-background">
      <Text className="mb-4 text-text-primary">Welcome to Monety!</Text>

      <Button title="Get Started" color={colors["--color-accent"]} onPress={() => {
        router.replace("/(drawer)/(tabs)/")
      }}/>
    </View>
  );
}
