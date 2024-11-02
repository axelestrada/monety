import { ReactElement } from "react";

import { TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactElement;
  highlight?: boolean;
  onPress?: () => void;
  active?: boolean;
}

const IconButton = ({ children, active, highlight, onPress }: Props) => {
  return (
    <TouchableOpacity
      className={`w-12 h-12 justify-center items-center rounded-full relative ${
        highlight && "bg-main dark:bg-[#F5F5F5]"
      }`}
      activeOpacity={0.5}
      onPress={onPress}
    >
      {children}
      {active && <View className="bg-accent w-1.5 h-1.5 rounded-full absolute bottom-1 left-[21]"></View>}
    </TouchableOpacity>
  );
};

export default IconButton;
