import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Modal from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import moment from "moment";
import IDateRange from "@/interfaces/dateRange";
import {CustomText} from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";
import { useDateRangePicker } from "@/context/DateRangePickerContext";

interface Props {
  active: boolean;
  onRequestClose: () => void;
}

const intervalsIcons: {
  title: IDateRange["interval"];
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    title: "day",
    icon: "time-outline",
  },
  {
    title: "week",
    icon: "calendar-outline",
  },
  {
    title: "month",
    icon: "calendar-number-outline",
  },
  {
    title: "year",
    icon: "calendar-clear-outline",
  },
  {
    title: "custom",
    icon: "create-outline",
  },
  {
    title: "all time",
    icon: "infinite-outline",
  },
];

export default function DateRangeIntervalSelector({ active, ...props }: Props) {
  const dispatch = useAppDispatch();
  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const { openDateRangePicker} = useDateRangePicker();

  const updateDateRange = (interval: IDateRange["interval"]) => {
    if (interval === "all time") {
      dispatch(
        userPreferencesServices.actions.updateDateRange({
          from: 0,
          to: moment().unix(),
          interval: interval,
        })
      );

      props.onRequestClose();

      return;
    }

    if (interval === "custom") {
      if (dateRange.interval === "custom") {
        openDateRangePicker();
      }

      openDateRangePicker();

      return;
    }

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment().startOf(interval).unix(),
        to: moment().endOf(interval).unix(),
        interval: interval,
      })
    );

    props.onRequestClose();
  };

  return (
    <>
      <Modal visible={active} {...props}>
        <View className="rounded-t-3xl bg-main-background p-3">
          <CustomText className="text-center text-lg font-[Rounded-Bold] text-text-primary">
            Select Interval
          </CustomText>

          {intervalsIcons.map(({ title, icon }) => (
            <IntervalItem
              active={title === dateRange.interval}
              title={title}
              icon={icon}
              updateInterval={() => updateDateRange(title)}
              key={title + icon}
            />
          ))}
        </View>
      </Modal>
    </>
  );
}

function IntervalItem({
  title,
  icon,
  active,
  updateInterval,
}: {
  active?: boolean;
  title: IDateRange["interval"];
  icon: keyof typeof Ionicons.glyphMap;
  updateInterval: () => void;
}) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      className="bg-card-background rounded-2xl p-3 py-4 mt-3"
      onPress={updateInterval}
      key={"IntervalSelectorItem" + title}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          color={colors["--color-text-primary"]}
          size={20}
        />

        <View className="ml-1.5" style={{ flex: 1 }}>
          <CustomText className="text-text-primary font-[Rounded-Medium] text-sm">
            {title[0].toUpperCase() + title.slice(1).toLowerCase()}
          </CustomText>
        </View>

        {active && (
          <View className="justify-center items-center rounded-full bg-accent-50 w-3.5 h-3.5">
            <View className="bg-accent w-[9] h-[9] rounded-full" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
