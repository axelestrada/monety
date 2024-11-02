import {
  Dimensions,
  FlatList,
  RefreshControlProps,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Category from "./Category";
import { ICategory } from "@/interfaces";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactElement, useState } from "react";
import { useTypedSelector } from "@/store";
import { useColorScheme } from "nativewind";
import CashFlowItem from "./CashFlowItem";

interface Props {
  categories: ICategory[];
  openModal: () => void;
  setCurrentCategory: (category: ICategory) => void;
  refreshControl: ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
  type: string;
  setType: React.Dispatch<React.SetStateAction<"Income" | "Expense">>;
}

const CategoriesGrid = ({
  categories,
  openModal,
  setCurrentCategory,
  refreshControl,
  type,
  setType,
}: Props) => {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const { transactions } = useTypedSelector((state) => state.transactions);

  return (
    <FlatList
      data={categories}
      refreshControl={refreshControl}
      ListHeaderComponent={() => (
        <View className="flex flex-row mx-1.5 mb-3 py-1.5 bg-[#ffffff80] dark:bg-[#E0E2EE00] dark:mx-1.5 rounded-2xl">
          <CashFlowItem
            type="Incomes"
            value={transactions
              .filter((transaction) => transaction.type === "Income")
              .reduce((acc, curr) => acc + curr.amount, 0)}
            active={type === "Income"}
            onPress={() => setType("Income")}
          />

          <CashFlowItem
            type="Expenses"
            value={transactions
              .filter((transaction) => transaction.type === "Expense")
              .reduce((acc, curr) => acc + curr.amount, 0)}
            active={type === "Expense"}
            onPress={() => setType("Expense")}
          />
        </View>
      )}
      renderItem={({ item }) =>
        item.id === "" ? (
          <TouchableOpacity
            activeOpacity={0.5}
            className="mb-3 mx-1.5 rounded-2xl justify-center items-center py-6"
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
            <Feather
              name="plus"
              color={colorScheme === "dark" ? "#6F717D" : "#1B1D1C"}
              size={18}
            />
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
        paddingTop: 20,
        paddingBottom: 8,
        paddingHorizontal: 6,
      }}
    />
  );
};

export default CategoriesGrid;
