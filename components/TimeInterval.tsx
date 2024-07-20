import { useState } from "react";
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


function TimeInterval() {
  const [showModal, setShowModal] = useState(false)

  return (
    <View style={styles.container}>
      {showModal ? <TimeIntervalModal visible={showModal} hideModal={() => setShowModal(false)} /> : null}

      <IconButton icon={faChevronLeft} iconSize={16} />

      <Pressable
        style={styles.interval}
        activeBackground={Colors.light.activeBackground}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.intervalText}>July 14 2024</Text>
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
    padding: 4
  },
  intervalText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.foreground
  },
});

export default TimeInterval;
