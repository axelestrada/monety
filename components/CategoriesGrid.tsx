import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import Category from "./Category";
import { ICategory } from "@/interfaces";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTypedSelector } from "@/store";

interface Props {
  categories: ICategory[];
  openModal: () => void;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
}

const CategoriesGrid = ({
  categories,
  openModal,
  setCurrentCategory,
}: Props) => {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  const { transactions } = useTypedSelector((state) => state.transactions);

  return (
    <FlatList
      data={categories}
      renderItem={({ item }) =>
        item.id === "" ? (
          <TouchableOpacity
            activeOpacity={0.5}
            className=" mb-[17] mt-[1] mx-[9] rounded-2xl justify-center items-center py-6"
            onPress={() => {
              router.navigate(`/add-category?type=${item.type}`);
            }}
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
          <Category
            onLongPress={() => {
              router.navigate(
                `/add-category?id=${item.id}&name=${item.name}&icon=${item.icon}&color=${item.color}&type=${item.type}`
              );
            }}
            onPress={() => {
              openModal();

              setCurrentCategory(item.id);
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
        paddingTop: 20,
        paddingBottom: 4,
        paddingHorizontal: 8,
      }}
    />
  );
};

export default CategoriesGrid;
