import { StyleSheet } from "react-native";

import Pressable from "./Pressable";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { Colors } from "@/constants/Colors";

function IconButton({
  icon,
  onPress,
  iconSize,
  iconColor = Colors.light.foreground
}: {
  icon: IconDefinition;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      activeBackground={Colors.light.activeBackground}
    >
      <FontAwesomeIcon icon={icon} size={iconSize || 20} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 100,
  },
});

export default IconButton;
