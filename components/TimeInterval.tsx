import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "./IconButton";
import Pressable from "./Pressable";

import { Colors } from "@/constants/Colors";

import {
  faCaretDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import TimeIntervalModal from "@/modals/TimeIntervalModal";
import { AppContext } from "@/state/AppProvider";
import moment from "moment";

function TimeInterval() {
  const { state } = useContext(AppContext);

  const { selectedInterval } = state;

  const [displayedDate, setDisplayedDate] = useState(
    moment(new Date()).format("MMM DD YYYY")
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedInterval.range || selectedInterval.week) {
      let startDate: Date = new Date();
      let endDate: Date = new Date();

      if (selectedInterval.range) {
        startDate = selectedInterval.range.startDate;
        endDate = selectedInterval.range.endDate;
      }

      if (selectedInterval.week) {
        startDate = selectedInterval.week.startDate;
        endDate = selectedInterval.week.endDate;
      }

      let formattedStartDate: string = "";

      if (startDate.getFullYear() !== endDate.getFullYear()) {
        formattedStartDate = moment(startDate).format("MMM DD YYYY");
      } else if (startDate.getMonth() !== endDate.getMonth()) {
        formattedStartDate = moment(startDate).format("MMM DD");
      } else if (startDate.getDate() !== endDate.getDate()) {
        formattedStartDate = moment(startDate).format("DD");
      }

      setDisplayedDate(
        formattedStartDate +
          (formattedStartDate !== "" ? " - " : "") +
          moment(endDate).format("MMM DD YYYY")
      );
    }

    if (selectedInterval.allTime) {
      setDisplayedDate("All time");
    }

    if (selectedInterval.day || selectedInterval.today) {
      setDisplayedDate(
        moment(selectedInterval.day || selectedInterval.today).format(
          "MMM DD YYYY"
        )
      );
    }

    if (selectedInterval.year) {
      setDisplayedDate(selectedInterval.year.toString() + " year");
    }

    if (selectedInterval.month) {
      setDisplayedDate(
        moment({
          month: selectedInterval.month.month,
          year: selectedInterval.month.year,
        }).format("MMM YYYY")
      );
    }
  }, [selectedInterval]);

  return (
    <View style={styles.container}>
      {showModal ? (
        <TimeIntervalModal
          visible={showModal}
          hideModal={() => setShowModal(false)}
        />
      ) : null}

      <IconButton icon={faChevronLeft} iconSize={16} />

      <Pressable
        style={styles.interval}
        activeBackground={Colors.light.activeBackground}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.intervalText}>{displayedDate}</Text>
        <FontAwesomeIcon icon={faCaretDown} />
      </Pressable>

      <IconButton icon={faChevronRight} iconSize={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  interval: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  intervalText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.foreground,
  },
});

export default TimeInterval;
