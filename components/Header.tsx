import { Octicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";
import { ReactElement } from "react";

interface Props {
  title: string;
  children: ReactElement;
}

const Header = ({ title, children }: Props) => {
  return (
    <View className="flex flex-row justify-between items-center p-4">
      <Text className="text-main text-2xl font-[Rounded-Bold]">{title}</Text>

      {children}
    </View>
  );
};

export default Header;
