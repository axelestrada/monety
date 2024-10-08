import { Dimensions, FlatList, RefreshControlProps, ScrollView, TouchableOpacity } from "react-native";
import Category from "./Category";
import { ICategory } from "@/interfaces";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactElement, useState } from "react";
import { useTypedSelector } from "@/store";
import { useColorScheme } from "nativewind";

interface Props {
  categories: ICategory[];
  openModal: () => void;
  setCurrentCategory: (category: ICategory) => void;
  refreshControl: ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>>
}

const CategoriesGrid = ({
  categories,
  openModal,
  setCurrentCategory,
  refreshControl
}: Props) => {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  const {colorScheme} = useColorScheme()

  const { transactions } = useTypedSelector((state) => state.transactions);

  return (
    <FlatList
      data={categories}
      refreshControl={refreshControl}
      renderItem={({ item }) =>
        item.id === "" ? (
          <TouchableOpacity
            activeOpacity={0.5}
            className="mb-3 mx-1.5 rounded-2xl justify-center items-center py-[23]"
            onPress={() => {
              router.navigate(`/add-category?type=${item.type}`);
            }}
            style={{
              width: (windowWidth - 36) / 2,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: colorScheme === "dark" ? "#6F717D" : "#1B1D1C",
            }}
          >
            <Feather name="plus" color={colorScheme === "dark" ? "#6F717D" : "#1B1D1C"} size={18} />
          </TouchableOpacity>
        ) : (
          <Category
            onLongPress={() => {
              router.navigate(
                `/add-category?id=${item.id}&name=${item.name}&icon=${item.icon}&color=${item.color}&type=${item.type}`
              );
            }}
            onPress={() => {
              openModal();

              setCurrentCategory(item);
            }}
            category={item}
            summary={transactions
              .filter((transaction) => transaction.categoryName === item.name)
              .reduce((acc, curr) => acc + curr.amount, 0)}
          />
        )
      }
      numColumns={2}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 16,
        paddingBottom: 4,
        paddingHorizontal: 6,
      }}
    />
  );
};

export default CategoriesGrid;
