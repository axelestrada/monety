import { ReactElement } from "react";

import { TouchableOpacity } from "react-native";

interface Props {
  children: ReactElement;
  highlight?: boolean;
  onPress?: () => void;
}

const IconButton = ({ children, highlight, onPress }: Props) => {
  return (
    <TouchableOpacity
      className={`p-3.5 -m-3.5 rounded-full ${
        highlight && "bg-main w-12 h-12 justify-center items-center "
      }`} 
      activeOpacity={0.5}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;
