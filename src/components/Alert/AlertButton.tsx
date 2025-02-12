import { TouchableOpacity } from "react-native";

import { AlertButtonConfig } from "./types/alertButton";

import { CustomText } from "../CustomText";

export const AlertButton = ({ title, onPress, style }: AlertButtonConfig) => {
  return (
    <TouchableOpacity className="flex-[1] items-center p-5" onPress={onPress}>
      <CustomText
        className={`font-[Rounded-Medium] text-[11px] ${
          style === "primary" ? "text-accent" : "text-text-primary"
        }`}
      >
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};
