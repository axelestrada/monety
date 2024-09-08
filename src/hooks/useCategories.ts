import { ICategory } from "@/interfaces";
import { categoriesServices } from "@/reducers/categoriesSlice";
import { useAppDispatch, useTypedSelector } from "@/store";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";

export default function useCategories() {
  const { categories } = useTypedSelector((state) => state.categories);
  const dispatch = useAppDispatch();

  const db = useSQLiteContext();

  const loadCategories = useCallback(async () => {
    try {
      const result = await db.getAllAsync<ICategory>(
        `
      SELECT * FROM Categories;
      `
      );

      dispatch(
        categoriesServices.actions.updateCategories([
          ...result,
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Income",
          },
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Expense",
          },
        ])
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  return { loadCategories, categories };
}
