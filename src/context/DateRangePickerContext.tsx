import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface DateRangePickerContextType {
  isDateRangePickerVisible: boolean;
  openDateRangePicker: () => void;
  closeDateRangePicker: () => void;
  toggleDateRangePickerVisibility: () => void;
}

const DateRangePickerContext = createContext<DateRangePickerContextType>({
  isDateRangePickerVisible: false,
  openDateRangePicker: () => {
    throw new Error("openDateRangePicker not implemented");
  },
  closeDateRangePicker: () => {
    throw new Error("closeDateRangePicker not implemented");
  },
  toggleDateRangePickerVisibility: () => {
    throw new Error("toggleDateRangePickerVisibility not implemented");
  },
});

interface DateRangePickerProviderProps {
  children: React.ReactNode;
}

export const DateRangePickerProvider = ({
  children,
}: DateRangePickerProviderProps) => {
  const [isDateRangePickerVisible, setIsDateRangePickerVisible] =
    useState(false);

  const openDateRangePicker = useCallback(() => {
    setIsDateRangePickerVisible(true);
  }, []);

  const closeDateRangePicker = useCallback(() => {
    setIsDateRangePickerVisible(false);
  }, []);

  const toggleDateRangePickerVisibility = useCallback(() => {
    setIsDateRangePickerVisible((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isDateRangePickerVisible,
      toggleDateRangePickerVisibility,
      openDateRangePicker,
      closeDateRangePicker,
    }),
    [
      isDateRangePickerVisible,
      toggleDateRangePickerVisibility,
      openDateRangePicker,
      closeDateRangePicker,
    ]
  );

  return (
    <DateRangePickerContext.Provider value={value}>
      {children}
    </DateRangePickerContext.Provider>
  );
};

export const useDateRangePicker = () => {
  const context = useContext(DateRangePickerContext);

  if (!context) {
    throw new Error(
      "useDateRangePicker must be used within a DateRangePickerProvider"
    );
  }
  return context;
};
