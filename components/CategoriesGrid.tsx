import { View } from "react-native";
import Category from "./Category";
import { CategoryInterface } from "@/database/models/category";
import { useCallback, useEffect } from "react";

interface Props {
  categories: CategoryInterface[];
}

const CategoriesGrid = ({ categories }: Props) => {
  return (
    <View className="flex flex-1 mb-8" style={{ gap: 16 }}>
      {categories.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </View>
  );
};

export default CategoriesGrid;
