import { createSlice } from "@reduxjs/toolkit";
import ICategory from "@/interfaces/category";

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

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;
