import { View } from "react-native";

interface MainContainerProps {
  children: React.ReactNode;
}

export default function MainContainer({children}: MainContainerProps) {
  return (
    <View className="flex-1 bg-main">
      {children}
    </View>
  );
}