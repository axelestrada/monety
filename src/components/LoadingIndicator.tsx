import { ActivityIndicator, View } from "react-native";
import useThemeColors from "@/hooks/useThemeColors";

export const LoadingIndicator = () => {
  const colors = useThemeColors();

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors["--color-accent"]} />
    </View>
  );
};
