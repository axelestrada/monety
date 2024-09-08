import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { ICategory } from "@/interfaces";
import { Octicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Modal, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewTransaction from "@/components/NewTransaction";
import { useCategories } from "@/hooks";
import { useTypedSelector } from "@/store";

function Categories() {
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [activeModal, setActiveModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  const { categories } = useCategories();
  const { transactions } = useTypedSelector((state) => state.transactions);

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Modal
        visible={activeModal}
        onRequestClose={() => setActiveModal(false)}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <NewTransaction
          hideModal={() => setActiveModal(false)}
          categoryId={currentCategory}
        />
      </Modal>

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
          value={transactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((acc, curr) => acc + curr.amount, 0)}
          active={type === "Income"}
          onPress={() => setType("Income")}
        />

        <CashFlowItem
          type="expenses"
          value={transactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((acc, curr) => acc + curr.amount, 0)}
          active={type === "Expense"}
          onPress={() => setType("Expense")}
        />
      </View>

      <CategoriesGrid
        categories={categories.filter((item) => item.type === type)}
        openModal={() => setActiveModal(true)}
        setCurrentCategory={setCurrentCategory}
      />

      <BottomTabNavigator />
    </SafeAreaView>
  );
}

export default Categories;
