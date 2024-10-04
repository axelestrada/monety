import { useRouter } from "expo-router";
import { ReactElement } from "react";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface Props {
  title: string;
  goBack?: boolean;
  children?: ReactElement;
}

const Header = ({ title, children, goBack }: Props) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row justify-between items-center py-2 px-3">
      {goBack && (
        <IconButton onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={18}
            color={colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C"}
          />
        </IconButton>
      )}

      <Text className="text-main dark:text-[#F5F5F5] text-xl font-[Rounded-Bold]">
        {title}
      </Text>

      {children}

      {goBack && children === undefined && <View></View>}
    </View>
  );
};

export default Header;
