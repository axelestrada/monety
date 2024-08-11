import { FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  category: {
    amount: number;
    name: string;
    icon: string;
    color: string;
  };
}

const Category = ({ category }: Props) => {
  const { amount, name, icon, color } = category;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="bg-white rounded-2xl p-4 flex-row items-center flex-1"
    >
      <View
        className={`justify-center items-center p-3 mr-2 rounded-full`}
        style={{ backgroundColor: color + "1A" }}
      >
        <FontAwesome6 name={icon} color={color} size={18} />
      </View>

      <View>
        <Text className="text-main font-[Rounded-Medium] text-lg">{name}</Text>

        <Text className="text-base font-[Rounded-Regular]" style={{ color }}>
          L {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Category;
