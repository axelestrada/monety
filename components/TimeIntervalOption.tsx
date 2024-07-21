import { Colors } from "@/constants/Colors";
import { ReactNode, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";
import Pressable from "./Pressable";

import { intervalModes } from "@/state/interfaces";
import { AppContext } from "@/state/AppProvider";
import { SELECTED_INTERVAL } from "@/state/actionTypes";

interface customStyles {
  full?: boolean;
  active?: boolean;
  borderRadius?: {
    tl?: number;
    tr?: number;
    bl?: number;
    br?: number;
  };
}

interface props extends customStyles {
  Icon: ({ width, height, fill }: SvgProps) => React.JSX.Element;
  text: string;
  type: (typeof intervalModes)[number];
  onPress: () => void;
}

function TimeIntervalOption({
  Icon,
  text,
  full = false,
  borderRadius,
  type,
  onPress
}: props) {
  const {state} = useContext(AppContext);

  const styles = styling({ full, borderRadius, active: state.selectedInterval[type] ? true : false });

  return (
    <Pressable
      style={styles.option}
      activeBackground={Colors.light.itemActiveBackground}
      onPress={onPress}
    >
      <Icon width={40} height={40} fill={Colors.light.foreground} />

      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styling = ({
  full,
  active,
  borderRadius = { tl: 0, tr: 0, bl: 0, br: 0 },
}: customStyles) => {
  const { tl, tr, bl, br } = borderRadius;

  return StyleSheet.create({
    option: {
      backgroundColor: active
        ? Colors.light.itemActiveBackground
        : Colors.light.mainBackground,
      padding: 20,
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flex: full ? 1 : 0.5,
      borderTopLeftRadius: tl,
      borderTopRightRadius: tr,
      borderBottomLeftRadius: bl,
      borderBottomRightRadius: br,
    },
    text: {
      color: Colors.light.foreground,
    },
  });
};

export default TimeIntervalOption;
