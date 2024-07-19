import { Colors } from "@/constants/Colors";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function Logo() {
  return (
    <View style={styles.logo}>
      <FontAwesomeIcon icon={faDollar} size={40} color={Colors.light.foreground} />

      <View style={styles.textContainer}>
        <Text style={styles.text}>Money</Text>

        <View style={styles.textHighlightContainer}>
          <Text style={[styles.text, styles.textHighlight]}>Manager</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    color: Colors.light.foreground,
    fontFamily: "Inter-Regular",
    fontSize: 26,
  },
  textHighlightContainer: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: Colors.light.textHighlightBackground,
  },
  textHighlight: {
    color: Colors.light.textHighlight,
  },
});

export default Logo;
