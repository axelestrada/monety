import { View, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Feather } from "@expo/vector-icons";

import useThemeColors from "@/hooks/useThemeColors";
import { useDateRangePicker } from "@/components/DateRangePicker/hooks/useDateRangePicker";

interface HeaderActionProps extends TouchableOpacityProps {
  icon?: keyof typeof Feather.glyphMap;
  badge?: boolean;
  color?: string;
  children?: React.ReactNode;
}

export const HeaderAction = ({
  icon,
  badge,
  color,
  children,
  ...props
}: HeaderActionProps) => {
  const colors = useThemeColors();

  const { openDateRangePicker } = useDateRangePicker();

  return (
    <TouchableOpacity
      onPress={icon === "calendar" ? openDateRangePicker : props.onPress}
      className="justify-center items-center w-11 h-11"
    >
      {icon && (
        <Feather
          name={icon}
          size={22}
          color={color || colors["--color-text-secondary"]}
        />
      )}

      {children}

      {badge && (
        <View className="bg-accent w-2 h-2 rounded-full absolute top-[0] right-[5]" />
      )}
    </TouchableOpacity>
  );
};
