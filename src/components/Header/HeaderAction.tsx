import { View, TouchableOpacity, useColorScheme } from "react-native";

import { Feather } from "@expo/vector-icons";

interface Props {
  icon: keyof typeof Feather.glyphMap;
  badge?: boolean;
}

export default function HeaderAction({ icon, badge }: Props) {
  const theme = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="border border-light-background dark:border-[#f5f5f50d] rounded-full w-10 h-10 mx-1 justify-center items-center"
    >
      <Feather
        name={icon}
        size={20}
        color={theme === "dark" ? "#F5F5F5" : "#1B1D1C"}
      />

      {badge && (
        <View className="bg-accent w-2 h-2 rounded-full absolute top-[7] right-[10]" />
      )}
    </TouchableOpacity>
  );
}
