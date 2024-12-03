import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import moment from "moment";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import { useColorScheme } from "nativewind";
import IconButton from "@/components/ui/IconButton";
import DateRangeIntervalSelector from "@/components/DateRangeIntervalSelector";

const DateRange = () => {
  const [showSelector, setShowSelector] = useState(false);

  const { dateRange, loading } = useTypedSelector(
    (state) => state.userPreferences
  );
  const dispatch = useAppDispatch();

  const { colorScheme } = useColorScheme();

  const previousDay = () => {
    if (
      loading ||
      dateRange.interval === "custom" ||
      dateRange.interval === "all time"
    )
      return;

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment(dateRange.from * 1000)
          .subtract(1, dateRange.interval)
          .unix(),
        to: moment(dateRange.to * 1000)
          .subtract(1, dateRange.interval)
          .unix(),
      })
    );
  };

  const nextDay = () => {
    if (
      loading ||
      dateRange.interval === "custom" ||
      dateRange.interval === "all time"
    )
      return;

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment(dateRange.from * 1000)
          .add(1, dateRange.interval)
          .unix(),
        to: moment(dateRange.to * 1000)
          .add(1, dateRange.interval)
          .unix(),
      })
    );
  };

  return (
    <>
      <DateRangeIntervalSelector
        active={showSelector}
        onRequestClose={() => setShowSelector(false)}
      />

      <View className="justify-between items-center flex-row w-full -my-2">
        <IconButton
          onPress={() => {
            previousDay();
          }}
        >
          <Feather
            name="chevron-left"
            color={colorScheme === "dark" ? "#f5f5f5" : "#1B1D1C"}
            size={24}
          />
        </IconButton>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowSelector(!showSelector)}
        >
          <Text className="text-main dark:text-[#f5f5f5] text-base font-[Rounded-Medium]">
            {dateRange.interval === "week"
              ? moment(dateRange.from * 1000).format("MMM DD") +
                " - " +
                moment(dateRange.to * 1000).format("MMM DD")
              : moment(dateRange.from * 1000).format(
                  dateRange.interval === "day"
                    ? "MMMM DD YYYY"
                    : dateRange.interval === "year"
                    ? "YYYY"
                    : dateRange.interval === "month"
                    ? "MMMM"
                    : "MMMM DD YYYY"
                )}
          </Text>
        </TouchableOpacity>

        <IconButton
          onPress={() => {
            nextDay();
          }}
        >
          <Feather
            name="chevron-right"
            color={colorScheme === "dark" ? "#f5f5f5" : "#1B1D1C"}
            size={24}
          />
        </IconButton>
      </View>
    </>
  );
};

export default DateRange;
