import { createSlice } from "@reduxjs/toolkit";
import { ICategory } from "@/interfaces";

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
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories = [
        ...state.categories.slice(0, -2),
        { ...action.payload },
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
      ];
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
});

export const categoriesServices = {
  actions: categoriesSlice.actions,
};

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;
