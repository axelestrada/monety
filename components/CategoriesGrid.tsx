import { View } from "react-native";
import Category from "./Category";

const data: {
  amount: number;
  name: string;
  icon: string;
  color: string;
}[] = [
  {
    amount: 120,
    name: "In Driver",
    icon: "taxi",
    color: "#3FE671",
  },
  {
    amount: 200,
    name: "Fuel",
    icon: "gas-pump",
    color: "#FF8092",
  },
  {
    amount: 56,
    name: "Uber",
    icon: "taxi",
    color: "#1B1D1C",
  },
  {
    amount: 200,
    name: "Food",
    icon: "bowl-food",
    color: "#FFE56E",
  },
];

const CategoriesGrid = () => {
  function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
  }

  const newData = [...chunks(data, 2)];

  return (
    <View className="flex flex-1 mb-8" style={{ gap: 16 }}>
      {newData.map((row, index) => (
        <View
          key={row[index].color}
          className="flex flex-1 flex-row"
          style={{ gap: 16 }}
        >
          {row.map((category) => (
            <Category
              key={category.amount + category.color}
              category={category}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default CategoriesGrid;
