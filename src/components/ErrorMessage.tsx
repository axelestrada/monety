import { View } from "react-native";

import useThemeColors from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "./CustomText";

interface ErrorMessageProps {
  children?: string;
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
  const colors = useThemeColors();

  return (
    <View className="items-center justify-center flex-1">
      <View className="rounded-full p-2" style={{ backgroundColor: colors["--color-error"] + "1A" }}>
        <Ionicons name="alert" size={24} color={colors["--color-error"]} />
      </View>

      <CustomText className="text-text-secondary text-sm mt-2 font-[Rounded-Medium]">
        {children || "An unexpected error occurred."}
      </CustomText>
    </View>
  );
};
