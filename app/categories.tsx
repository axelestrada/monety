import { CustomText } from "@/components/CustomText";
import Header from "@/components/Header/Header";
import MainContainer from "@/components/MainContainer";
import Screen from "@/components/Screen";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import { normalizeCategory } from "@/features/categories/normalizers/normalizeCategory";
import { categoriesServices } from "@/features/categories/redux/reducers/categoriesSlice";
import ICategory from "@/features/categories/types/category";
import useThemeColors from "@/hooks/useThemeColors";
import { useAppDispatch, useTypedSelector } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import moment from "moment";
import { useColorScheme } from "nativewind";
import { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { parse } from "react-native-svg";

export default function Categories() {
  const themeColors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const db = useSQLiteContext();
  const dispatch = useAppDispatch();

  const { categories } = useTypedSelector((state) => state.categories);

  const [category, setCategory] = useState({
    name: "",
    color: "",
    icon: "",
    type: "expense",
  });

  const handleSubmit = useCallback(async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO Categories (name, color, icon, type) VALUES (?, ?, ?, ?);",
          [
            category.name,
            parseInt(category.color),
            parseInt(category.icon),
            category.type,
          ]
        );

        const categories = await db.getAllAsync<any>(
          "SELECT * FROM Categories;"
        );

        dispatch(
          categoriesServices.actions.setCategories(
            categories.map((category) => normalizeCategory(category))
          )
        );

        setCategory({
          name: "",
          color: "",
          icon: "",
          type: "expense",
        });
      });
    } catch (error) {
      console.error("Error inserting category: ", error);
      alert("Error inserting category");
    }
  }, [category]);

  return (
    <Screen>
      <Header title="Categories" drawer showDateRange overallBalance></Header>

      <MainContainer>
        <View className="flex-row flex-wrap">
          {colors.map((color) => (
            <View
              key={"CategoryColor: " + color.id}
              className="rounded-full m-2 justify-center items-center"
              style={{
                width: 50,
                height: 50,
                backgroundColor: color[colorScheme || "light"],
              }}
            >
              <CustomText className="text-white">{color.id}</CustomText>
            </View>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {icons.map((icon) => (
            <View
              key={"CategoryIcon: " + icon.id}
              className="rounded-full m-2 justify-center items-center bg-card-background"
              style={{
                width: 50,
                height: 50,
              }}
            >
              <Ionicons
                name={icon.name}
                size={22}
                color={themeColors["--color-text-primary"]}
              ></Ionicons>

              <CustomText className="text-text-primary text-s">
                {icon.id}
              </CustomText>
            </View>
          ))}
        </View>

        {categories.map((category) => (
          <View key={"Category" + category.id} className="m-3">
            <Text className="text-text-primary">Id: {category.id}</Text>
            <Text className="text-text-primary">Name: {category.name}</Text>
            <Text className="text-text-primary">Color: {category.color}</Text>
            <Text className="text-text-primary">Type: {category.type}</Text>
            <Text className="text-text-primary">Icon: {category.icon}</Text>
          </View>
        ))}

        <View className="m-5">
          <View className="mx-3">
            <Text className="text-text-primary">name: {category.name}</Text>
            <Text className="text-text-primary">color: {category.color}</Text>
            <Text className="text-text-primary">icon: {category.icon}</Text>
            <Text className="text-text-primary">type: {category.type}</Text>
          </View>

          <TextInput
            placeholder="Name"
            className="bg-card-background m-3 p-3 text-text-primary"
            value={category.name}
            onChangeText={(text) =>
              setCategory((prev) => ({ ...prev, name: text }))
            }
          />

          <TextInput
            placeholder="Color"
            className="bg-card-background m-3 p-3 text-text-primary"
            value={category.color}
            onChangeText={(text) =>
              setCategory((prev) => ({ ...prev, color: text }))
            }
          />

          <TextInput
            placeholder="Icon"
            className="bg-card-background m-3 p-3 text-text-primary"
            value={category.icon}
            onChangeText={(text) =>
              setCategory((prev) => ({ ...prev, icon: text }))
            }
          />

          <TextInput
            placeholder="Type"
            className="bg-card-background m-3 p-3 text-text-primary"
            value={category.type}
            onChangeText={(text) =>
              setCategory((prev) => ({ ...prev, type: text }))
            }
          />

          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </MainContainer>
    </Screen>
  );
}
