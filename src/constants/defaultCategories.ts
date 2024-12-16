import ICategory from "@/interfaces/category";

export const defaultCategories: ICategory[] = [
  {
    id: 1,
    name: "Food",
    icon: 20,
    color: 1,
    type: "expense",
  },
  {
    id: 2,
    name: "Cafe",
    icon: 19,
    color: 4,
    type: "expense",
  },
  {
    id: 3,
    name: "Entertainment",
    icon: 18,
    color: 25,
    type: "expense",
  },
  {
    id: 4,
    name: "Transport",
    icon: 17,
    color: 13,
    type: "expense",
  },
  { id: 5, name: "Health", icon: 16, color: 20, type: "expense" },
  { id: 6, name: "Pets", icon: 15, color: 11, type: "expense" },
  { id: 7, name: "Family", icon: 14, color: 14, type: "expense" },
  { id: 8, name: "Clothes", icon: 13, color: 15, type: "expense" },
  { id: 9, name: "Salary", icon: 12, color: 20, type: "income" },
];
