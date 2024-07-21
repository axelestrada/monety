import { View, Text, StyleSheet } from "react-native";

import Modal from "@/components/Modal";
import { Colors } from "@/constants/Colors";

import TimeIntervalOption from "@/components/TimeIntervalOption";

import CalendarRange from "@/icons/CalendarRange";
import CalendarInfinite from "@/icons/CalendarInfinite";
import CalendarDay from "@/icons/CalendarDay";
import CalendarWeek from "@/icons/CalendarWeek";
import CalendarToday from "@/icons/CalendarToday";
import CalendarYear from "@/icons/CalendarYear";
import CalendarMonth from "@/icons/CalendarMonth";
import TextButton from "@/components/TextButton";
import { useContext } from "react";
import { AppContext } from "@/state/AppProvider";
import { SELECTED_INTERVAL } from "@/state/actionTypes";
import moment from "moment";

export default function TimeIntervalModal({
  visible,
  hideModal,
}: {
  visible?: boolean;
  hideModal: () => void;
}) {
  const { dispatch } = useContext(AppContext);

  const intervalDefault = {
    range: undefined,
    allTime: undefined,
    day: undefined,
    week: undefined,
    today: undefined,
    year: undefined,
    month: undefined,
  };

  const setRange = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: {
        ...intervalDefault,
        range: {
          startDate: new Date(2024, 7, 20),
          endDate: new Date(),
        },
      },
    });

    hideModal();
  };

  const setAll = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: { ...intervalDefault, allTime: true },
    });

    hideModal();
  };

  const setDay = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: { ...intervalDefault, day: new Date(2024, 5, 15) },
    });

    hideModal();
  };

  const setWeek = () => {
    const startDate = new Date(
      moment(new Date()).startOf("week").toLocaleString()
    );
    const endDate = new Date(moment(new Date()).endOf("week").toLocaleString());

    dispatch({
      type: SELECTED_INTERVAL,
      payload: {
        ...intervalDefault,
        week: {
          startDate,
          endDate,
        },
      },
    });

    hideModal();
  };

  const setToday = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: { ...intervalDefault, today: new Date() },
    });

    hideModal();
  };

  const setYear = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: { ...intervalDefault, year: new Date().getFullYear() },
    });

    hideModal();
  };

  const setMonth = () => {
    dispatch({
      type: SELECTED_INTERVAL,
      payload: {
        ...intervalDefault,
        month: { year: new Date().getFullYear(), month: new Date().getMonth() },
      },
    });

    hideModal();
  };

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <View style={styles.container}>
        <Text style={styles.title}>Time interval</Text>

        <View style={styles.options}>
          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              full
              type="range"
              borderRadius={{ tl: 16, tr: 16 }}
              text="Select date range"
              Icon={CalendarRange}
              onPress={setRange}
            />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              type="allTime"
              text="All time"
              Icon={CalendarInfinite}
              onPress={setAll}
            />
            <TimeIntervalOption
              type="day"
              text="Choose a day"
              Icon={CalendarDay}
              onPress={setDay}
            />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              type="week"
              text="Week"
              Icon={CalendarWeek}
              onPress={setWeek}
            />
            <TimeIntervalOption
              type="today"
              text="Today"
              Icon={CalendarToday}
              onPress={setToday}
            />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              type="year"
              borderRadius={{ bl: 16 }}
              text="Year"
              Icon={CalendarYear}
              onPress={setYear}
            />

            <TimeIntervalOption
              type="month"
              borderRadius={{ br: 16 }}
              text="Month"
              Icon={CalendarMonth}
              onPress={setMonth}
            />
          </View>
        </View>

        <View style={styles.cancelButton}>
          <TextButton text="Cancel" onPress={hideModal} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 28,
    borderRadius: 28,
    width: "80%",
    backgroundColor: Colors.light.modalCardBackground,
  },
  title: {
    color: Colors.light.foreground,
    fontFamily: "Inter-Regular",
    fontSize: 24,
  },
  options: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
  },
  cancelButton: {
    paddingTop: 12,
    transform: [{ translateX: 16 }],
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
