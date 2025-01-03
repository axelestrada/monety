import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import moment from "moment";

import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";

import { CustomText } from "@/components/CustomText";
import IconButton from "@/components/ui/IconButton";
import DateRangeIntervalSelector from "@/components/DateRangeIntervalSelector";

import useThemeColors from "@/hooks/useThemeColors";

import { formatDateRange } from "@/utils/formatDateRange";

import IDateRange from "@/interfaces/dateRange";

const DateRange = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();

  const [showIntervalSelector, setShowIntervalSelector] = useState(false);

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const previousDate = (
    interval: IDateRange["interval"],
    daysOfDifference?: number
  ) => {
    if (interval === "all time") return;

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment(dateRange.from * 1000)
          .subtract(
            interval === "custom" ? daysOfDifference : 1,
            interval === "custom" ? "days" : interval
          )
          .unix(),
        to: moment(dateRange.to * 1000)
          .subtract(
            interval === "custom" ? daysOfDifference : 1,
            interval === "custom" ? "days" : interval
          )
          .unix(),
      })
    );
  };

  const nextDate = (
    interval: IDateRange["interval"],
    daysOfDifference?: number
  ) => {
    if (interval === "all time") return;

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment(dateRange.from * 1000)
          .add(
            interval === "custom" ? daysOfDifference : 1,
            interval === "custom" ? "days" : interval
          )
          .unix(),
        to: moment(dateRange.to * 1000)
          .add(
            interval === "custom" ? daysOfDifference : 1,
            interval === "custom" ? "days" : interval
          )
          .unix(),
      })
    );
  };

  const handleArrowClick = (direction: "left" | "right") => {
    if (dateRange.interval === "all time") return;

    const daysOfDifference =
      moment(dateRange.to * 1000).diff(moment(dateRange.from * 1000), "days") +
      1;

    if (direction === "left") {
      previousDate(dateRange.interval, daysOfDifference);
    } else {
      nextDate(dateRange.interval, daysOfDifference);
    }
  };

  return (
    <View className="mx-1 mt-2">
      <DateRangeIntervalSelector
        active={showIntervalSelector}
        onRequestClose={() => setShowIntervalSelector(false)}
      />

      <View className="justify-between items-center flex-row w-full -mt-2">
        <IconButton onPress={() => handleArrowClick("left")}>
          <Feather
            name="chevron-left"
            color={colors["--color-text-secondary"]}
            size={24}
          />
        </IconButton>

        <TouchableOpacity
          onPress={() => setShowIntervalSelector(!showIntervalSelector)}
        >
          <CustomText className="text-text-secondary text-sm font-[Rounded-Medium]">
            {formatDateRange(dateRange)}
          </CustomText>
        </TouchableOpacity>

        <IconButton onPress={() => handleArrowClick("right")}>
          <Feather
            name="chevron-right"
            color={colors["--color-text-secondary"]}
            size={24}
          />
        </IconButton>
      </View>
    </View>
  );
};

export default DateRange;
