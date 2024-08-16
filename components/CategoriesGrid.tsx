import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import Category from "./Category";
import { CategoryInterface } from "@/interfaces/category";
import { Feather } from "@expo/vector-icons";

interface Props {
  categories: CategoryInterface[];
}

const CategoriesGrid = ({ categories }: Props) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <FlatList
      data={categories}
      renderItem={({ item }) =>
        item.id === "" ? (
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
          <Category category={item} />
        )
      }
      numColumns={2}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 4,
        paddingHorizontal: 8,
      }}
    />
  );
};

export default CategoriesGrid;
