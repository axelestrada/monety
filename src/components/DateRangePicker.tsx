import { useEffect, useState } from "react";
import moment from "moment";

import { ModalProps, View } from "react-native";

import useThemeColors from "@/hooks/useThemeColors";

import Modal from "@/components/Modal";
import CustomDateTimePicker, { IDateRange } from "@/components/CustomDateTimePicker";

interface DateRangePickerProps extends ModalProps {
  initialRange?: IDateRange;
  callback: (range: IDateRange) => void;
  onRequestClose: () => void;
}

const DateRangePicker = ({
  initialRange,
  callback,
  onRequestClose,
  visible,
  ...props
}: DateRangePickerProps) => {
  const colors = useThemeColors();

  const [range, setRange] = useState<IDateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (visible && initialRange) {
      setRange({
        startDate: initialRange.startDate,
        endDate: initialRange.endDate,
      });
    }
  }, [visible]);

  const onChange = (params:IDateRange) => {
    setRange(params);
  };

  return (
    <Modal
      {...props}
      visible={visible}
      marginTop={false}
      onRequestClose={() => {
        onRequestClose();

        if (range.startDate !== undefined)
          callback({
            startDate: range.startDate,
            endDate:
              range.endDate ||
              moment(range.startDate?.valueOf()).endOf("day").toDate(),
          });

        setRange({ startDate: undefined, endDate: undefined });
      }}
    >
      <View className="bg-card-background dark:bg-main-background mx-10 p-3 rounded-2xl">
        <CustomDateTimePicker
          mode="range"
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={onChange}
        />
      </View>
    </Modal>
  );
};

export default DateRangePicker;
