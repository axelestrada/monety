import { createContext, useCallback, useContext, useState } from "react";

interface DateRangePickerContextType {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  toggleModal: () => void;
}

const DateRangePickerContext = createContext<
  DateRangePickerContextType | undefined
>(undefined);

interface DateRangePickerProviderProps {
  children: React.ReactNode;
}

export const DateRangePickerProvider = ({
  children,
}: DateRangePickerProviderProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  return (
    <DateRangePickerContext.Provider
      value={{ isModalVisible, setIsModalVisible, toggleModal }}
    >
      {children}
    </DateRangePickerContext.Provider>
  );
};

export const useDateRangePicker = () => {
  const context = useContext(DateRangePickerContext);

  if (context === undefined) {
    throw new Error(
      "useDateRangePicker must be used within a DateRangePickerProvider"
    );
  }
  return context;
};
