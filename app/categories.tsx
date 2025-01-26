import MainContainer from "@/components/MainContainer";
import Screen from "@/components/Screen";
import { useTypedSelector } from "@/store";
import { Text, View } from "react-native";

export default function Categories() {
  const { categories } = useTypedSelector((state) => state.categories);
  return (
    <Screen>
      <Text className="text-center mb-3 text-xl">Categories</Text>

      <MainContainer>
        {categories.map((category) => (
          <View key={"Category" + category.id} className="m-3">
            <Text>Id: {category.id}</Text>
            <Text>Name: {category.name}</Text>
            <Text>Color: {category.color}</Text>
            <Text>Type: {category.type}</Text>
            <Text>Icon: {category.icon}</Text>
          </View>
        ))}
      </MainContainer>
    </Screen>
  );
}
