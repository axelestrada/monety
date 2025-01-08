import useThemeColors from "@/hooks/useThemeColors";
import { ReactElement } from "react";

import { TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactElement;
  highlight?: boolean;
  onPress?: () => void;
  active?: boolean;
  shadow?: boolean;
}

const IconButton = ({
  children,
  active,
  shadow,
  highlight,
  onPress,
}: Props) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      className={`w-11 h-11 justify-center items-center rounded-full relative ${
        highlight && "bg-text-primary"
      }`}
      onPress={onPress}
      style={
        shadow
          ? {
              shadowColor: colors["--color-shadow-50"],
              elevation: 10,
              backgroundColor: colors["--color-icon-button-background"],
              borderRadius: 6,
              width: 36,
              height: 36,
            }
          : {}
      }
    >
      {children}
      {active && (
        <View className="bg-accent dark:bg-dark-accent w-1.5 h-1.5 rounded-full absolute bottom-1 left-[21]"></View>
      )}
    </TouchableOpacity>
  );
};

export default IconButton;
