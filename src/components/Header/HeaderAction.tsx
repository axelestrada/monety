import { View, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

interface Props {
  icon: keyof typeof Feather.glyphMap;
  badge?: boolean;
}

export default function HeaderAction({ icon, badge }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.5} className="border border-light-background rounded-full w-10 h-10 mx-1 justify-center items-center">
      <Feather name={icon} size={20} color="#1b1d1c" />

      {badge && <View className="bg-accent w-2 h-2 rounded-full absolute top-[7] right-[10]" />}
    </TouchableOpacity>
  );
}
