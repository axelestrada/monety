import { TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useTypedSelector } from "@/store";
import { userPreferencesServices } from "@/reducers/userPreferencesSlice";
import moment from "moment";
import IDateRange from "@/interfaces/dateRange";
import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";
import { useDateRangePicker } from "@/context/DateRangePickerContext";
import { CustomModal } from "@/components/CustomModal";
import IconButton from "@/components/ui/IconButton";

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

  const { openDateRangePicker } = useDateRangePicker();

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
      props.onRequestClose();
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
    <CustomModal
      isVisible={active}
      onRequestClose={props.onRequestClose}
      position="bottom"
    >
      <View className="rounded-t-3xl bg-main-background">
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
    </CustomModal>
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
      className="p-3 border-b border-separator"
      onPress={updateInterval}
      key={"IntervalSelectorItem" + title}
    >
      <View className="flex-row items-center">
        <View
          className="p-1.5 mr-3 rounded-full"
          style={{ backgroundColor: colors["--color-accent"] + "1A" }}
        >
          <Ionicons name={icon} color={colors["--color-accent"]} size={18} />
        </View>

        <View className="" style={{ flex: 1 }}>
          <CustomText className="text-text-primary font-[Rounded-Medium] text-s">
            {title[0].toUpperCase() + title.slice(1).toLowerCase()}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
