import { darkColors } from "@/constants/colors";
import { ICategory } from "@/interfaces";
import { styles } from "@/styles/shadow";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface Props extends TouchableOpacityProps {
  category: ICategory;
  summary: number;
}

const Category = ({ category, summary = 0, ...params }: Props) => {
  const windowWidth = Dimensions.get("window").width;

  const { colorScheme } = useColorScheme();

  const { name, icon, color } = category;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl py-3 px-2 mb-3 mx-1.5 flex-row items-center"
      style={{ width: (windowWidth - 36) / 2, ...{elevation: 16, shadowColor: "#1b1d1c1f"} }}
      {...params}
    >
      <View
        className={`justify-center items-center p-3.5 mr-1.5 rounded-full`}
        style={{
          backgroundColor:
            "#" + (colorScheme === "dark" ? darkColors[color] : color) + "1A",
        }}
      >
        <Ionicons
          name={icon}
          color={"#" + (colorScheme === "dark" ? darkColors[color] : color)}
          size={16}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          className="text-main dark:text-[#E0E2EE] font-[Rounded-Medium] text-lg"
        >
          {name}
        </Text>

        <Text
          className="text-base font-[Rounded-Regular]"
          style={{
            color: "#" + (colorScheme === "dark" ? darkColors[color] : color),
          }}
        >
          L {Intl.NumberFormat("en-US").format(summary)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Category;
