import { View, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Feather } from "@expo/vector-icons";

import useThemeColors from "@/hooks/useThemeColors";

interface HeaderActionProps extends TouchableOpacityProps {
  icon: keyof typeof Feather.glyphMap;
  badge?: boolean;
  color?: string;
}

export default function HeaderAction({
  icon,
  badge,
  color,
  ...props
}: HeaderActionProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.5}
      className="justify-center items-center mx-1.5 w-7 h-7"
    >
      <Feather
        name={icon}
        size={22}
        color={color || colors["--color-icon-primary"]}
      />

      {badge && (
        <View className="bg-accent w-2 h-2 rounded-full absolute top-[0] right-[5]" />
      )}
    </TouchableOpacity>
  );
}
