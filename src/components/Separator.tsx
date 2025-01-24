import { View } from "react-native";

interface SeparatorProps {
  className?: string;
}

export const Separator = ({ className }: SeparatorProps) => {
  return <View className={`bg-separator h-[1] ${className}`}></View>;
};
