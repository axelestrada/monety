import { CategoryInterface } from "@/database/models/category";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface Props {
  category: CategoryInterface;
}



const Category = ({ category }: Props) => {
  const windowWidth = Dimensions.get("window").width;

  const { title, icon, color, parentId } = category;

  return parentId === 7 ? (
    <TouchableOpacity
      activeOpacity={0.5}
      className=" mb-[17] mt-[1] mx-[9] rounded-2xl justify-center items-center py-6"
      style={{
        width: (windowWidth - 50) / 2,
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#1B1D1C",
      }}
    >
      <Feather name="plus" color={"#1B1D1C"} size={20} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      activeOpacity={0.5}
      className="bg-white rounded-2xl p-4 mb-4 mx-2 flex-row items-center"
      style={{ width: (windowWidth - 48) / 2 }}
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
