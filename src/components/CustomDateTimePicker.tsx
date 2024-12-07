import { Feather } from "@expo/vector-icons";

import useThemeColors from "@/hooks/useThemeColors";

import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import {
  ModeType,
  MultiChange,
  RangeChange,
  SingleChange,
} from "react-native-ui-datepicker/lib/typescript/src/types";

interface DateTimePickerProps {
  mode: ModeType;
  startDate: DateType;
  endDate: DateType;
  onChange: RangeChange | SingleChange | MultiChange;
}

export interface IDateRange {
  startDate: DateType;
  endDate: DateType;
}

const CustomDateTimePicker = ({
  mode,
  startDate,
  endDate,
  onChange,
}: DateTimePickerProps) => {
  const colors = useThemeColors();

  return (
    <DateTimePicker
      mode={mode}
      buttonPrevIcon={
        <Feather
          name="chevron-left"
          color={colors["--color-accent"]}
          size={24}
        />
      }
      buttonNextIcon={
        <Feather
          name="chevron-right"
          color={colors["--color-accent"]}
          size={24}
        />
      }
      headerTextStyle={{
        color: colors["--color-text-primary"],
        fontSize: 20,
        fontFamily: "Rounded-Bold",
        fontStyle: "normal",
        fontWeight: "normal",
      }}
      headerButtonsPosition="right"
      headerButtonStyle={{
        backgroundColor: colors["--color-icon-button-background"],
        elevation: 10,
        borderRadius: 6,
        shadowColor: colors["--color-shadow-50"],
      }}
      calendarTextStyle={{
        color: colors["--color-text-primary"],
        fontFamily: "Rounded-Medium",
        fontStyle: "normal",
        fontWeight: "normal",
      }}
      todayContainerStyle={{
        borderWidth: 2,
        borderRadius: 12,
      }}
      dayContainerStyle={{
        borderRadius: 12,
      }}
      selectedItemColor={colors["--color-accent"]}
      weekDaysContainerStyle={{
        borderColor: colors["--color-icons-outline"],
      }}
      weekDaysTextStyle={{
        color: colors["--color-text-primary-40"],
        fontFamily: "Rounded-Medium",
        fontStyle: "normal",
        fontWeight: "normal",
      }}
      yearContainerStyle={{
        borderRadius: 12,
        borderColor: colors["--color-icons-outline"],
        backgroundColor: colors["--color-card-background"],
      }}
      monthContainerStyle={{
        borderRadius: 12,
        borderColor: colors["--color-icons-outline"],
        backgroundColor: colors["--color-card-background"],
      }}
      displayFullDays
      startDate={startDate}
      endDate={endDate}
      onChange={(params: any) => onChange(params)}
    />
  );
};

export default CustomDateTimePicker;
