import { ActivityIndicator, Image, View } from "react-native";

import Screen from "@/components/Screen";
import CustomText from "@/components/CustomText";

import useThemeColors from "@/hooks/useThemeColors";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export const SplashScreen = () => {
  const colors = useThemeColors();

  return (
    <Screen>
      <View className="flex-[1] justify-center items-center">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 64,
            height: 64,
            resizeMode: "contain",
            borderRadius: 16,
          }}
        />

        <CustomText className="text-text-primary text-3xl font-[Rounded-Bold] mt-2">Monety</CustomText>
      </View>

      <View className="mb-4">
        <LoadingIndicator />
      </View>
    </Screen>
  );
};
