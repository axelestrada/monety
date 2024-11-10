import { createSlice } from "@reduxjs/toolkit";
import { ITimeRange } from "@/interfaces";

import moment from "moment";

interface IInitialState {
  timeRange: ITimeRange;
  loading: boolean;
}

const initialState: IInitialState = {
  timeRange: {
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
    updateTimeRange: (state, action) => {
      state.timeRange = { ...state.timeRange, ...action.payload };
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

const userPreferencesReducer = userPreferencesSlice.reducer;

export default userPreferencesReducer;
