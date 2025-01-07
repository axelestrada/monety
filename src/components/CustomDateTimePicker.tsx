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
      height={280}
      buttonPrevIcon={
        <Feather
          name="chevron-left"
          color={colors["--color-accent"]}
          size={20}
        />
      }
      buttonNextIcon={
        <Feather
          name="chevron-right"
          color={colors["--color-accent"]}
          size={20}
        />
      }
      headerTextStyle={{
        color: colors["--color-text-primary"],
        fontSize: 16,
        fontFamily: "Rounded-Medium",
        fontStyle: "normal",
        fontWeight: "normal",
      }}
      headerButtonsPosition="around"
      calendarTextStyle={{
        color: colors["--color-text-secondary"],
        fontFamily: "Rounded-Medium",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
      }}
      todayContainerStyle={{
        borderColor: "transparent",
      }}
      todayTextStyle={{
        color: colors["--color-accent"],
      }}
      dayContainerStyle={{
        borderRadius: 8,
        width: 40,
        height: 24,
      }}
      selectedItemColor={colors["--color-accent"]}
      weekDaysContainerStyle={{
        borderColor: colors["--color-icons-outline"],
        borderBottomWidth: 0,
        marginBottom: 6,
      }}
      weekDaysTextStyle={{
        color: colors["--color-text-secondary"],
        fontSize: 12,
        fontFamily: "Rounded-Regular",
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
