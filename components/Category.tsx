import { CategoryInterface } from "@/database/models/category";
import {  Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  category: CategoryInterface
}

const Category = ({ category }: Props) => {
  const { title, icon, color } = category;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="bg-white rounded-2xl p-4 flex-row items-center flex-1"
    >
      <View
        className={`justify-center items-center p-3 mr-2 rounded-full`}
        style={{ backgroundColor: color + "1A" }}
      >
        <Ionicons name={icon} color={color} size={18} />
      </View>

      <View>
        <Text className="text-main font-[Rounded-Medium] text-lg">{title}</Text>

        <Text className="text-base font-[Rounded-Regular]" style={{ color }}>
          L 110
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Category;
