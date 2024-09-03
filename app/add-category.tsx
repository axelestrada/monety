import Header from "@/components/Header";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { ICategory } from "@/interfaces/category";
import { styles } from "@/styles/shadow";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import uuid from "react-native-uuid";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";

const AddCategory = () => {
  const params: {
    id?: string;
    name: string;
    icon: (typeof icons)[number];
    color: (typeof colors)[number];
    type?: "Income" | "Expense";
  } = useLocalSearchParams();

  const [category, setCategory] = useState<{
    id?: string;
    name: string;
    icon: (typeof icons)[number];
    color: (typeof colors)[number];
    type?: "Income" | "Expense";
  }>({
    name: params.name || "",
    icon: params.icon || "accessibility-outline",
    color: params.color || "623387",
  });

  const [type, setType] = useState<"Income" | "Expense">(
    params.type || "Expense"
  );

  const db = useSQLiteContext();
  const router = useRouter();

  const saveCategory = async () => {
    const { name, icon, color } = category;

    if (name === "") return;

    try {
      if (params.id) {
        await db.runAsync(
          `
        UPDATE Categories SET name = ?, icon = ?, color = ?, type = ? WHERE id = ?;
      `,
          [name, icon, color, type, params.id]
        );
      } else {
        await db.runAsync(
          `
        INSERT INTO Categories (id, name, icon, color, type) VALUES (?, ?, ?, ?, ?);
      `,
          [uuid.v4().toString(), name, icon, color, type]
        );
      }

      setCategory((prev) => ({ ...prev, id: undefined, name: "" }));
      router.back();
    } catch (error) {
      console.error();
    }
  };

  const deleteCategory = async () => {
    try {
      if (params.id) {
        await db.runAsync(
          `
          DELETE FROM Categories WHERE id = ?
          `,
          params.id
        );
      }

      router.back();
    } catch (error) {
      console.error();
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Header title={params.id ? "Edit Category" : "Add Category"} goBack />

      <View className="flex flex-row justify-between bg-[#ffffff33] mx-4 mt-2 py-2 rounded-2xl">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setType("Income")}
          className={`${
            type === "Income" && "bg-white"
          } flex flex-1 rounded-2xl p-4 mx-2 flex-row items-center justify-center`}
          style={type === "Income" ? styles.shadow : {}}
        >
          <Text className="text-main font-[Rounded-Bold] text-lg">Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setType("Expense")}
          className={`${
            type === "Expense" && "bg-white"
          } flex flex-1 rounded-2xl p-4 mx-2 flex-row items-center justify-center`}
          style={type === "Expense" ? styles.shadow : {}}
        >
          <Text className="text-main font-[Rounded-Bold] text-lg">Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="grow">
          <View className="mx-4 mt-4">
            <Text className="font-[Rounded-Medium] text-base mb-3">
              Category name
            </Text>
            <TextInput
              value={category.name}
              placeholder="Enter category name"
              onChangeText={(text) =>
                setCategory((prev) => ({ ...prev, name: text }))
              }
              className="bg-white rounded-lg p-3 text-base"
              style={{ fontFamily: "Rounded-Medium", ...styles.shadow }}
            />
          </View>

          <View className="mx-2 mt-4">
            <Text className="font-[Rounded-Medium] text-base mx-2 mb-3">
              Choose icon
            </Text>

            <FlatList
              data={icons.map((icon, index) => ({
                id: index,
                name: icon,
              }))}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={item.id + item.name}
                  onPress={() =>
                    setCategory((prev) => ({ ...prev, icon: item.name }))
                  }
                  className={`${
                    category.icon === item.name ? "bg-white" : "bg-[#FFFFFF33]"
                  } rounded-lg p-4 mb-4 mx-2`}
                  style={category.icon === item.name ? styles.shadow : {}}
                >
                  <Ionicons name={item.name} size={28} color="#1B1D1C" />
                </TouchableOpacity>
              )}
              numColumns={5}
              columnWrapperStyle={{
                flex: 1,
                justifyContent: "space-between",
              }}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>

          <View className="mx-4">
            <Text className="font-[Rounded-Medium] text-base mb-3">
              Choose color
            </Text>
            <FlatList
              data={colors.map((color, index) => ({
                id: index,
                code: color,
              }))}
              contentContainerStyle={{ paddingBottom: 16 }}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={item.id + item.code}
                  onPress={() =>
                    setCategory((prev) => ({ ...prev, color: item.code }))
                  }
                  className={`${
                    category.color === item.code ? "bg-white" : "bg-[#FFFFFF33]"
                  } rounded-lg p-4 mb-4 mr-4`}
                  style={category.color === item.code ? styles.shadow : {}}
                >
                  <View
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: "#" + item.code }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={saveCategory}
          className="bg-main mx-4 mb-4 rounded-full p-4"
          style={styles.shadow}
        >
          <Text
            className="text-white text-center font-[Rounded-Medium] text-base"
            style={styles.shadow}
          >
            {params.id ? "Save" : "Create new category"}
          </Text>
        </TouchableOpacity>

        {params.id && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={deleteCategory}
            className="bg-[#E93043] mx-4 mb-4 rounded-full p-4"
            style={styles.shadow}
          >
            <Text
              className="text-white text-center font-[Rounded-Medium] text-base"
              style={styles.shadow}
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCategory;
