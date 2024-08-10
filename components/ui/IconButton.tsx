import { ReactElement } from "react";

import { TouchableOpacity } from "react-native";

interface Props {
  children: ReactElement;
  primary?: boolean;
}

const IconButton = ({ children, primary }: Props) => {
  return (
    <TouchableOpacity
      className={`p-2 -m-2 ${
        primary && "bg-main rounded-full w-12 h-12 justify-center items-center "
      }`}
      activeOpacity={0.5}
    >
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;
