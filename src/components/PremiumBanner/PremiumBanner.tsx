import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { CustomText } from "../CustomText";
import useThemeColors from "@/hooks/useThemeColors";
import { useColorScheme } from "nativewind";
import { Feather, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { usePremiumBanner } from "./hooks/usePremiumBanner";

export const PremiumBanner = () => {
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const { isPremiumBannerVisible, hidePremiumBanner } = usePremiumBanner();

  if (!isPremiumBannerVisible) return null;

  return (
    <View
      className="absolute bottom-3 left-3 bg-accent-background flex-row items-center justify-center rounded-lg p-2"
      style={
        colorScheme === "light"
          ? {
              elevation: 5,
              shadowColor: colors["--color-shadow-75"],
            }
          : {}
      }
    >
      <MaterialCommunityIcons
        name="check-decagram"
        size={20}
        color={colors["--color-accent-dark"]}
      />

      <CustomText className="font-[Rounded-Bold] text-xs text-accent-dark ml-1">
        Premium
      </CustomText>

      <Pressable
        onPress={() => {
          hidePremiumBanner();
        }}
        className="absolute bg-accent-25 rounded-full justify-center items-center"
        style={{
          top: -3,
          right: -3,
          width: 12,
          height: 12,
        }}
      >
        <Feather name="x" size={9} color={colors["--color-accent-dark"]} />
      </Pressable>
    </View>
  );
};
