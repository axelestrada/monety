import { createSlice } from "@reduxjs/toolkit";
import IDateRange from "@/types/dateRange";

import moment from "moment";

interface IInitialState {
  dateRange: IDateRange;
  loading: boolean;
}

const initialState: IInitialState = {
  dateRange: {
    from: moment().startOf("day").unix(),
    to: moment().endOf("day").unix(),
    interval: "day",
  },
  loading: true,
};

const userPreferencesSlice = createSlice({
  name: "userPreferencesSlice",
  initialState,
  reducers: {
    updateDateRange: (
      state,
      action: {
        payload: Partial<IDateRange>;
      }
    ) => {
      state.dateRange = { ...state.dateRange, ...action.payload };
    },
    setLoading: (
      state,
      action: {
        payload: boolean;
      }
    ) => {
      state.loading = action.payload;
    },
  },
});

export const userPreferencesServices = {
  actions: userPreferencesSlice.actions,
};

export const userPreferencesReducer = userPreferencesSlice.reducer;
