import { useContext } from "react";
import { DateRangePickerContext } from "@/components/DateRangePicker/DateRangePickerContext";

export const useDateRangePicker = () => {
  const context = useContext(DateRangePickerContext);

  if (!context) {
    throw new Error(
      "useDateRangePicker must be used within a DateRangePickerProvider"
    );
  }
  return context;
};