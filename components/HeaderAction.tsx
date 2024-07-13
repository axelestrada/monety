import { StyleSheet } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import Pressable from "./Pressable";
import { Colors } from "@/constants/Colors";

function HeaderAction({
  icon,
  onPress,
}: {
  icon: IconDefinition;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.button} activeBackground={Colors.light.activeBackground}>
      <FontAwesomeIcon icon={icon} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 100,
  },
});

export default HeaderAction;
