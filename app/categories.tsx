import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Category from "@/components/Category";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { Octicons } from "@expo/vector-icons";
import { ReactElement, ReactNode, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Categories() {
  const [type, setType] = useState<"incomes" | "expenses">("incomes");

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Header title="Categories">
        <IconButton>
          <Octicons name="pencil" size={20} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <View
        className="flex flex-row mt-4 mx-4 p-2 bg-[#FFFFFF80] rounded-2xl"
        style={{ gap: 16 }}
      >
        <CashFlowItem
          type="incomes"
          value={1250}
          active={type === "incomes"}
          onPress={() => setType("incomes")}
        />

        <CashFlowItem
          type="expenses"
          value={570}
          active={type === "expenses"}
          onPress={() => setType("expenses")}
        />
      </View>

      <ScrollView className="flex flex-1 pt-4 px-4">
       <CategoriesGrid/>
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
}

export default Categories;
