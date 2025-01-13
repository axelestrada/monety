import { createSlice } from "@reduxjs/toolkit";
import ICategory from "@/features/categories/types/category";

interface IInitialState {
  categories: ICategory[];
}

const initialState: IInitialState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState,
  reducers: {
    setCategories: (
      state,
      action: {
        payload: ICategory[];
      }
    ) => {
      state.categories = action.payload;
    },
  },
});

export const categoriesServices = {
  actions: categoriesSlice.actions,
};

export const categoriesReducer = categoriesSlice.reducer;
