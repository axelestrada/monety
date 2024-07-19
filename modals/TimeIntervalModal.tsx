import { View, Text, StyleSheet } from "react-native";

import Modal from "@/components/Modal";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import TimeIntervalOption from "@/components/TimeIntervalOption";
import CalendarRange from "@/icons/CalendarRange";
import CalendarInfinite from "@/icons/CalendarInfinite";
import CalendarDay from "@/icons/CalendarDay";
import CalendarWeek from "@/icons/CalendarWeek";
import CalendarToday from "@/icons/CalendarToday";
import CalendarYear from "@/icons/CalendarYear";
import CalendarMonth from "@/icons/CalendarMonth";
import Pressable from "@/components/Pressable";
import TextButton from "@/components/TextButton";

export default function TimeIntervalModal({
  visible,
  hideModal,
}: {
  visible?: boolean;
  hideModal?: () => void;
}) {
  return (
    <Modal visible={visible} hideModal={hideModal}>
      <View style={styles.container}>
        <Text style={styles.title}>Time interval</Text>

        <View style={styles.options}>
          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              full
              borderRadius={{ tl: 16, tr: 16 }}
              text="Select date range"
              Icon={CalendarRange}
            />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption text="All time" Icon={CalendarInfinite} />
            <TimeIntervalOption text="Choose a day" Icon={CalendarDay} />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption text="Week" Icon={CalendarWeek} />
            <TimeIntervalOption text="Today" Icon={CalendarToday} />
          </View>

          <View style={[styles.options, styles.row]}>
            <TimeIntervalOption
              borderRadius={{ bl: 16 }}
              text="Year"
              Icon={CalendarYear}
            />

            <TimeIntervalOption
              borderRadius={{ br: 16 }}
              text="Month"
              Icon={CalendarMonth}
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
    transform: [{translateX: 16}],
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
