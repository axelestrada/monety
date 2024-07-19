import { StyleSheet, Text } from "react-native";

import Pressable from "./Pressable";
import { Colors } from "@/constants/Colors";

function TextButton({ text, onPress }: { text: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      activeBackground={Colors.light.textButtonBackground}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  text: {
    fontFamily: "Inter-Regular",
    color: Colors.light.textButtonForeground,
  },
});

export default TextButton;
