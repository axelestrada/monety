import { View } from "react-native";

import { AlertProps } from "./types/alert";

import { CustomText } from "../CustomText";
import { AlertButton } from "./AlertButton";

export const Alert = ({ alertOptions, onRequestClose }: AlertProps) => {
  const { title, buttons } = alertOptions;

  const executeAction = (action?: () => void) => {
    if (action) action();

    onRequestClose();
  };

  return (
    <View
      className="bg-main-background dark:bg-card-background rounded-3xl"
      style={{
        minWidth: 220,
      }}
    >
      <View className="p-5 items-center border-b border-separator">
        <CustomText className="font-[Rounded-Medium] text-text-secondary text-xs">
          {title}
        </CustomText>
      </View>

      <View className="flex-row">
        {buttons.length === 0 ? (
          <AlertButton title="ACCEPT" onPress={onRequestClose} />
        ) : (
          buttons.map(({ onPress, ...props }, idx) => (
            <AlertButton
              key={`AlertButton${idx}${props.title}`}
              onPress={() => {
                executeAction(onPress);
              }}
              {...props}
            />
          ))
        )}
      </View>
    </View>
  );
};
