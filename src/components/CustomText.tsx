import { Text, TextProps } from "react-native";

export const CustomText = (props: TextProps) => (
  <Text {...props} allowFontScaling={false} />
);
