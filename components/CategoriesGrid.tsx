import { FlatList, Text, View } from "react-native";
import Category from "./Category";
import { CategoryInterface } from "@/database/models/category";

interface Props {
  categories: CategoryInterface[];
}

const CategoriesGrid = ({ categories }: Props) => {
  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => <Category category={item} />}
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
