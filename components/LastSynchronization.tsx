import { Colors } from "@/constants/Colors";
import { faCheck, faCloud } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, View } from "react-native";
import Pressable from "./Pressable";

function LastSynchronization() {
  return (
    <Pressable style={styles.container} activeBackground={Colors.light.activeBackground} >
      <CloudIcon />
      <Text style={styles.text}>Today at 16:57</Text>
    </Pressable>
  );
}

const CloudIcon = () => {
  return (
    <View style={styles.cloudIcon}>
      <FontAwesomeIcon icon={faCloud} color={Colors.light.green} size={20} />

      <View style={styles.cloudStatus}>
        <FontAwesomeIcon icon={faCheck} color="#ffffff" size={10} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  text: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.light.textLight,
  },
  cloudIcon: {
    position: "relative",
  },
  cloudStatus: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LastSynchronization;
