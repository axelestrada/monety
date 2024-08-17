import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { CategoryInterface } from "@/interfaces/category";
import { Octicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Categories() {
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  const db = useSQLiteContext();
  const segments = useSegments();

  const getCategories = useCallback(async () => {
    const result = await db.getAllAsync<CategoryInterface>(
      `
      SELECT * FROM Categories WHERE type = ?;
      `,
      type
    );

    setCategories([
      ...result,
      {
        id: "",
        name: "",
        icon: "accessibility-outline",
        color: "623387",
        type,
      },
    ]);
  }, [type]);

  useEffect(() => {
    getCategories();
  }, [type]);

  useEffect(() => {
    if (segments[0] === "categories") getCategories();
  }, [segments]);

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Header title="Categories">
        <IconButton>
          <Octicons name="pencil" size={20} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance>
        <TimeRange />
      </OverallBalance>

      <View className="flex flex-row mx-4 py-2 bg-[#ffffff80] rounded-2xl">
        <CashFlowItem
          type="incomes"
          value={1250}
          active={type === "Income"}
          onPress={() => setType("Income")}
        />

        <CashFlowItem
          type="expenses"
          value={570}
          active={type === "Expense"}
          onPress={() => setType("Expense")}
        />
      </View>

      <CategoriesGrid categories={categories} />

      <BottomTabNavigator />
    </SafeAreaView>
  );
}

export default Categories;
