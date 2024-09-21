import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";
import moment from "moment";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import { useTransactions } from "@/hooks";

const TimeRange = () => {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const dispatch = useAppDispatch();

  const { loadTransactions } = useTransactions();

  const previousDay = () => {
    dispatch(
      userPreferencesServices.actions.updateTimeRange({
        from: moment(timeRange.from * 1000)
          .subtract(1, "day")
          .unix(),
        to: moment(timeRange.to * 1000)
          .subtract(1, "day")
          .unix(),
      })
    );

  };

  const nextDay = () => {
    dispatch(
      userPreferencesServices.actions.updateTimeRange({
        from: moment(timeRange.from * 1000)
          .add(1, "day")
          .unix(),
        to: moment(timeRange.to * 1000)
          .add(1, "day")
          .unix(),
      })
    );

  };

  return (
    <View className="mt-1 justify-between items-center flex flex-row w-full">
      <IconButton
        onPress={() => {
          previousDay();
        }}
      >
        <Feather name="chevron-left" color="#1B1D1C" size={22} />
      </IconButton>

      <Text className="text-main text-base font-[Rounded-Medium]">
        {moment(timeRange.from * 1000).format("MMMM DD YYYY")}
      </Text>

      <IconButton
        onPress={() => {
          nextDay();
        }}
      >
        <Feather name="chevron-right" color="#1B1D1C" size={22} />
      </IconButton>
    </View>
  );
};

export default TimeRange;
