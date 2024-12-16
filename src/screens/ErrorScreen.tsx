import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/Screen";
import CustomText from "@/components/CustomText";

import useThemeColors from "@/hooks/useThemeColors";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

interface ErrorScreenProps {
  title: string;
  description: string;
  onTryAgain: () => void;
}

export const ErrorScreen = ({
  title,
  description,
  onTryAgain,
}: ErrorScreenProps) => {
  const colors = useThemeColors();

  return (
    <Screen>
      <View className="flex-1 justify-center items-center mx-3">
        <StatusBar backgroundColor={colors["--color-main-background"]} />

        <View
          className="rounded-full p-6 mb-16"
          style={{ backgroundColor: colors["--color-error"] + "1A" }}
        >
          <Ionicons name="alert" size={100} color={colors["--color-error"]} />
        </View>

        <View className="items-center">
          <CustomText className="mb-2 font-[Rounded-Bold] text-xl text-text-primary">
            {title.toUpperCase()}
          </CustomText>
          <CustomText className="text-center text-text-secondary font-[Rounded-Regular]">
            {description}
          </CustomText>
        </View>

        <TouchableOpacity
          className="mt-16 rounded-lg"
          activeOpacity={0.5}
          onPress={onTryAgain}
        >
          <LinearGradient
            colors={[
              colors["--color-accent-gradient-start"],
              colors["--color-accent-gradient-end"],
            ]}
            style={{ borderRadius: 8 }}
            className="py-3 px-4"
          >
            <CustomText className="text-text-white font-[Rounded-Bold]">
              TRY AGAIN
            </CustomText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};
