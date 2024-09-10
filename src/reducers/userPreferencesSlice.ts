import { createSlice } from "@reduxjs/toolkit";
import { ITimeRange } from "@/interfaces";

import moment from "moment";

interface IInitialState {
  timeRange: ITimeRange;
}

const initialState: IInitialState = {
  timeRange: {
    from: moment().startOf("day").unix(),
    to: moment().endOf("day").unix(),
  },
};

const userPreferencesSlice = createSlice({
  name: "userPreferencesSlice",
  initialState,
  reducers: {
    updateTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
  },
});

export const userPreferencesServices = {
  actions: userPreferencesSlice.actions,
};

const userPreferencesReducer = userPreferencesSlice.reducer;

export default userPreferencesReducer;
