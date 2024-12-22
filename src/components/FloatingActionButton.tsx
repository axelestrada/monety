import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import useThemeColors from "@/hooks/useThemeColors";

interface FloatingActionButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}

export const FloatingActionButton = ({
  icon,
  onPress,
}: FloatingActionButtonProps) => {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      className="w-16 h-16 absolute bottom-7 right-3 z-20"
      onPress={onPress}
    >
      <LinearGradient
        colors={[
          colors["--color-accent-gradient-start"],
          colors["--color-accent-gradient-end"],
        ]}
        className="flex-1 justify-center items-center"
        style={{ borderRadius: 20 }}
      >
        <Feather name={icon} size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};
