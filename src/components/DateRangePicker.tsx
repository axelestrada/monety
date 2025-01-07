import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import { CustomText } from "@/components/CustomText";
import { useDateRangePicker } from "@/context/DateRangePickerContext";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import { useAppDispatch, useTypedSelector } from "@/store";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { DateType } from "react-native-ui-datepicker";

interface IDateRange {
  startDate: DateType;
  endDate: DateType;
}

const { height: screenHeight } = Dimensions.get("window");

export const DateRangePicker = () => {
  const { isDateRangePickerVisible, closeDateRangePicker } =
    useDateRangePicker();

    const {dateRange} = useTypedSelector((state) => state.userPreferences);

    const dispatch = useAppDispatch();

  const [range, setRange] = useState<IDateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const translateY = useSharedValue(screenHeight);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isDateRangePickerVisible) {
      translateY.value = withTiming(0, { duration: 200 });

      setRange({
        startDate: moment(dateRange.from * 1000).toDate(),
        endDate: moment(dateRange.to * 1000).toDate(),
      });
    } else {
      translateY.value = withTiming(screenHeight + 50, { duration: 200 });

      dispatch(
        userPreferencesServices.actions.updateDateRange({
            from: moment(range.startDate?.valueOf()).unix(),
            to: moment(range.endDate?.valueOf() ?? range.startDate?.valueOf()).endOf("day").unix(),
            interval: "custom",
        })
      );
    }
  }, [isDateRangePickerVisible]);

  const onChange = useCallback((params: IDateRange) => {
    setRange(params);
  }, []);

  const setToday = useCallback(() => {
    setRange({
      startDate: moment().toDate(),
      endDate: moment().endOf("day").toDate(),
    });

    closeDateRangePicker();
  }, []);

  return (
    <Animated.View
      className="flex-1"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        className="flex-1 bg-modal-background justify-end"
        activeOpacity={1}
        onPress={closeDateRangePicker}
      >
        <TouchableWithoutFeedback onPress={closeDateRangePicker}>
          <View className="bg-main-background p-3 pb-0 rounded-t-3xl">
            <CustomDateTimePicker
              mode="range"
              startDate={range.startDate}
              endDate={range.endDate}
              onChange={onChange}
            />

            <View className="flex-row justify-between -mx-3 border-t border-separator">
              <TouchableOpacity
                className="flex-[1] items-center p-5"
                onPress={closeDateRangePicker}
              >
                <CustomText className="font-[Rounded-Medium] text-sm text-text-primary">
                  Close
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-[1] items-center p-5"
                onPress={setToday}
              >
                <CustomText className="font-[Rounded-Medium] text-sm text-text-primary">
                  Today
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Animated.View>
  );
};
