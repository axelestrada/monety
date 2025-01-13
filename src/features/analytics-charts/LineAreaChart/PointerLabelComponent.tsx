import { View } from "react-native";

import { CustomText } from "../../../components/CustomText";

interface PointerLabelComponentProps {
  title: string;
  items: {
    value: string;
    color: string;
  }[];
}

const PointerLabelComponent = ({
  title,
  items,
}: PointerLabelComponentProps) => {
  return (
    <View className="flex-1 justify-center items-center py-1">
      <CustomText className="text-text-primary text-xs font-[Rounded-Medium]">
        {title}
      </CustomText>

      <View className="flex-row items-center justify-center flex-1 w-full px-1">
        {items.map(({ value, color }, index) => (
          <CustomText
            key={index + value + color}
            className="pr-1 text-xs font-[Rounded-Medium]"
            style={{
              color: color,
            }}
          >
            {value}
          </CustomText>
        ))}
      </View>
    </View>
  );
};

export default PointerLabelComponent;
