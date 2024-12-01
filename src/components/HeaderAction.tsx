import { View, TouchableOpacity,  TouchableOpacityProps } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface Props extends TouchableOpacityProps {
  icon: keyof typeof Feather.glyphMap;
  badge?: boolean;
}

export default function HeaderAction({ icon, badge, ...others }: Props) {
  const {colorScheme} = useColorScheme();

  return (
    <TouchableOpacity
      {...others}
      activeOpacity={0.5}
      className="border border-light-background dark:border-[#f5f5f50d] rounded-full w-10 h-10 mx-1 justify-center items-center"
    >
      <Feather
        name={icon}
        size={20}
        color={colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"}
      />

      {badge && (
        <View className="bg-accent dark:bg-dark-accent w-2 h-2 rounded-full absolute top-[7] right-[10]" />
      )}
    </TouchableOpacity>
  );
}
