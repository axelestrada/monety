import { View, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Feather } from "@expo/vector-icons";

import useThemeColors from "@/hooks/useThemeColors";

interface HeaderActionProps extends TouchableOpacityProps {
  icon: keyof typeof Feather.glyphMap;
  badge?: boolean;
}

export default function HeaderAction({
  icon,
  badge,
  ...props
}: HeaderActionProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.5}
      className="justify-center items-center"
      style={{
        width: 36,
        height: 36,
      }}
    >
      <Feather name={icon} size={20} color={colors["--color-text-primary"]} />

      {badge && (
        <View className="bg-accent w-2 h-2 rounded-full absolute top-[7] right-[10]" />
      )}
    </TouchableOpacity>
  );
}
