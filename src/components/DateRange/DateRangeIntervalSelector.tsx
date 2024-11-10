import React, { useEffect, useState } from "react";
import {
  ModalProps,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "../Modal/Modal";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import moment from "moment";

interface Props {
  active: boolean;
  onRequestClose: () => void;
}

const intervals: {
  title: "day" | "week" | "month" | "year" | "all time" | "custom";
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
    title: "all time",
    icon: "infinite-outline",
  },
  {
    title: "custom",
    icon: "create-outline",
  },
];

export default function DateRangeIntervalSelector({ active, ...props }: Props) {
  const dispatch = useAppDispatch();
  const { timeRange } = useTypedSelector((state) => state.userPreferences);

  const updateTimeRange = (
    interval: "day" | "week" | "month" | "year" | "all time" | "custom"
  ) => {
    if (interval !== "custom" && interval !== "all time")
      dispatch(
        userPreferencesServices.actions.updateTimeRange({
          from: moment().startOf(interval).unix(),
          to: moment().endOf(interval).unix(),
          interval: interval,
        })
      );
  };
  return (
    <Modal visible={active} {...props}>
      <View className="rounded-t-3xl bg-light-background dark:bg-[#121212] p-3">
        <Text className="text-center text-xl font-[Rounded-Bold] text-main dark:text-[#f5f5f5]">
          Select Interval
        </Text>

        {intervals.map(({ title, icon }) => (
          <IntervalItem
            active={title === timeRange.interval}
            title={title}
            icon={icon}
            updateInterval={() => updateTimeRange(title)}
            key={title + icon}
          />
        ))}
      </View>
    </Modal>
  );
}

function IntervalItem({
  title,
  icon,
  active,
  updateInterval,
}: {
  active?: boolean;
  title: "day" | "week" | "month" | "year" | "all time" | "custom";
  icon: keyof typeof Ionicons.glyphMap;
  updateInterval: () => void;
}) {
  const { colorScheme } = useColorScheme();

  const isDisabled =
    title === "custom" || title === "all time" || title === "year";

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-3 py-4 mt-3 shadow-md shadow-main-25"
      style={{ opacity: isDisabled ? 0.5 : 1 }}
      onPress={updateInterval}
      key={title}
      disabled={isDisabled}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          color={colorScheme === "light" ? "#1b1d1c" : "#f5f5f5"}
          size={18}
        />

        <View className="ml-1.5" style={{ flex: 1 }}>
          <Text className="text-main dark:text-[#f5f5f5] font-[Rounded-Medium] text-base">
            {title[0].toUpperCase() + title.slice(1).toLowerCase()}
          </Text>
        </View>

        {active && (
          <View className="justify-center items-center bg-[#ff288284] w-3.5 h-3.5 rounded-full">
            <View className="bg-accent dark:bg-dark-accent w-[9] h-[9] rounded-full" />
          </View>
        )}
      </View>

      {isDisabled && (
        <Text className="text-[#1b1d1c80] dark:text-[#f5f5f5] font-[Rounded-Medium] text-base absolute bottom-4 right-3">
          Coming Soon!
        </Text>
      )}
    </TouchableOpacity>
  );
}
