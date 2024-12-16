import { ActivityIndicator, View } from "react-native";

import Screen from "@/components/Screen";
import CustomText from "@/components/CustomText";

import useThemeColors from "@/hooks/useThemeColors";

interface LoadingScreenProps {
  description?: string;
}

export const LoadingScreen = ({ description }: LoadingScreenProps) => {
  const colors = useThemeColors();

  return (
    <Screen>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={64} color={colors["--color-accent"]} />
        <CustomText className="font-[Rounded-Medium] text-text-primary mt-4">
          {description}
        </CustomText>
      </View>
    </Screen>
  );
};
