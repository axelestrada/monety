import { CategoryInterface } from "@/interfaces/category";
import uuid from "react-native-uuid";

export const defaultCategories: CategoryInterface[] = [
  {
    id: uuid.v4().toString(),
    name: "Food",
    icon: "fast-food-outline",
    color: "#744E8C",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Cafe",
    icon: "cafe-outline",
    color: "#E9579F",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Entertainment",
    icon: "film-outline",
    color: "#08AFE7",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Transport",
    icon: "bus-outline",
    color: "#EA8F3D",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Health",
    icon: "medkit-outline",
    color: "#0BAF87",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Pets",
    icon: "paw-outline",
    color: "#C37949",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Family",
    icon: "people-outline",
    color: "#F55351",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Clothes",
    icon: "shirt-outline",
    color: "#F5C818",
    type: "Expense",
  },
  {
    id: uuid.v4().toString(),
    name: "Salary",
    icon: "cash-outline",
    color: "#3AB073",
    type: "Income",
  },
];
