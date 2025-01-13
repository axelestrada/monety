import { CustomDateTimePicker } from "@/components/DateRangePicker/CustomDateTimePicker";
import { CustomText } from "@/components/CustomText";
import { useDateRangePicker } from "@/components/DateRangePicker/hooks/useDateRangePicker";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import { useAppDispatch, useTypedSelector } from "@/store";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DateType } from "react-native-ui-datepicker";
import { CustomModal } from "@/components/CustomModal";

interface IDateRange {
  startDate: DateType;
  endDate: DateType;
}

export const DateRangePicker = () => {
  const { isDateRangePickerVisible, closeDateRangePicker } =
    useDateRangePicker();

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const dispatch = useAppDispatch();

  const [range, setRange] = useState<IDateRange>({
    startDate: moment(dateRange.from * 1000).toDate(),
    endDate: moment(dateRange.to * 1000).toDate(),
  });

  const handleClose = useCallback(() => {
    closeDateRangePicker();

    if (
      moment(range.startDate?.valueOf()).unix() === dateRange.from &&
      moment(range.endDate?.valueOf()).unix() === dateRange.to
    ) {
      return;
    }

    dispatch(
      userPreferencesServices.actions.updateDateRange({
        from: moment(range.startDate?.valueOf()).unix(),
        to: moment(range.endDate?.valueOf() ?? range.startDate?.valueOf())
          .endOf("day")
          .unix(),
        interval: "custom",
      })
    );
  }, [closeDateRangePicker, range]);

  useEffect(() => {
    if (isDateRangePickerVisible) {
      setRange({
        startDate: moment(dateRange.from * 1000).toDate(),
        endDate: moment(dateRange.to * 1000).toDate(),
      });
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

    handleClose();
  }, []);

  return (
    <CustomModal
      isVisible={isDateRangePickerVisible}
      onRequestClose={handleClose}
      position="bottom"
      priority={2}
    >
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
            onPress={handleClose}
          >
            <CustomText className="font-[Rounded-Medium] text-base text-text-primary">
              Close
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-[1] items-center p-5"
            onPress={setToday}
          >
            <CustomText className="font-[Rounded-Medium] text-base text-text-primary">
              Today
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};
