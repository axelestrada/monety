import { CategoryInterface } from "@/interfaces/category";
import uuid from "react-native-uuid";

export const defaultCategories: CategoryInterface[] = [
  {
    id: uuid.v4().toString(),
    name: "Food",
    icon: "fast-food-outline",
    color: "623387",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Cafe",
    icon: "cafe-outline",
    color: "E92689",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Entertainment",
    icon: "film-outline",
    color: "00AEF4",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Transport",
    icon: "bus-outline",
    color: "E7883A",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Health",
    icon: "medkit-outline",
    color: "00AD74",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Pets",
    icon: "paw-outline",
    color: "BA6945",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Family",
    icon: "people-outline",
    color: "EF5F37",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Clothes",
    icon: "shirt-outline",
    color: "F1AB31",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Salary",
    icon: "cash-outline",
    color: "00AD74",
    type: "Income",
  },
];
