import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import moment from "moment";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import { useColorScheme } from "nativewind";
import IconButton from "@/components/ui/IconButton";

const TimeRange = () => {
  const { timeRange, loading } = useTypedSelector((state) => state.userPreferences);
  const dispatch = useAppDispatch();

  const {colorScheme} = useColorScheme()

  const previousDay = () => {
    if (loading) return;

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
    if (loading) return;

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
    <View className="justify-between items-center flex-row w-full -my-2">
      <IconButton
        onPress={() => {
          previousDay();
        }}
      >
        <Feather name="chevron-left"color={colorScheme === "dark" ? "#f5f5f5" : "#1B1D1C"} size={24} />
      </IconButton>

      <Text className="text-main dark:text-[#f5f5f5] text-base font-[Rounded-Medium]">
        {moment(timeRange.from * 1000).format("MMMM DD YYYY")}
      </Text>

      <IconButton
        onPress={() => {
          nextDay();
        }}
      >
        <Feather name="chevron-right"color={colorScheme === "dark" ? "#f5f5f5" : "#1B1D1C"} size={24} />
      </IconButton>
    </View>
  );
};

export default TimeRange;
