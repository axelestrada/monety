import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import {
  createCategoriesTable,
  getCategories,
  getDBConnection,
} from "@/database/db";
import { CategoryInterface } from "@/database/models/category";
import { Octicons } from "@expo/vector-icons";
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  const [type, setType] = useState<0 | 1>(1);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  useEffect(() => {
    setCategories([
      {
        color: "#744E8C",
        icon: "fast-food-outline",
        id: 1,
        parentId: null,
        title: "Food",
        type: 1,
      },
      {
        color: "#E9579F",
        icon: "cafe-outline",
        id: 2,
        parentId: null,
        title: "Cafe",
        type: 1,
      },
      {
        color: "#08AFE7",
        icon: "film-outline",
        id: 3,
        parentId: null,
        title: "Entertainment",
        type: 1,
      },
      {
        color: "#EA8F3D",
        icon: "bus-outline",
        id: 4,
        parentId: null,
        title: "Transport",
        type: 1,
      },
      {
        color: "#0BAF87",
        icon: "medkit-outline",
        id: 5,
        parentId: null,
        title: "Health",
        type: 1,
      },
      {
        color: "#C37949",
        icon: "paw-outline",
        id: 6,
        parentId: null,
        title: "Pets",
        type: 1,
      },
      {
        color: "#F55351",
        icon: "people-outline",
        id: 7,
        parentId: null,
        title: "Family",
        type: 1,
      },
      {
        color: "#F5C818",
        icon: "shirt-outline",
        id: 8,
        title: "Clothes",
        parentId: null,
        type: 1,
      },
      {
        color: "",
        icon: "",
        id: 0,
        parentId: 7,
        title: "",
        type: 0,
      },
    ]);
  }, []);

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

      <View
        className="flex flex-row mx-4 p-2 bg-[#ffffff99] rounded-2xl"
        style={{ gap: 16 }}
      >
        <CashFlowItem
          type="incomes"
          value={1250}
          active={type === 0}
          onPress={() => setType(0)}
        />

        <CashFlowItem
          type="expenses"
          value={570}
          active={type === 1}
          onPress={() => setType(1)}
        />
      </View>

      <CategoriesGrid categories={categories} />

      <BottomTabNavigator />
    </SafeAreaView>
  );
}

export default Categories;
