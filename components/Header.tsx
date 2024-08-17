import { useRouter } from "expo-router";
import { ReactElement } from "react";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  goBack?: boolean;
  children?: ReactElement;
}

const Header = ({ title, children, goBack }: Props) => {
  const router = useRouter();

  return (
    <View className="flex flex-row justify-between items-center p-4">
      {goBack && (
        <IconButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1B1D1C" />
        </IconButton>
      )}

      <Text className="text-main text-2xl font-[Rounded-Bold]">{title}</Text>

      {children}

      {goBack && children === undefined && <View></View>}
    </View>
  );
};

export default Header;
