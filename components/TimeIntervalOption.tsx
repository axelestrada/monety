import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface customStyles {
  full?: boolean;
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
}

function TimeIntervalOption({ Icon, text, full = false, borderRadius }: props) {
  const styles = styling({ full, borderRadius });

  return (
    <View style={styles.option}>
      <Icon width={40} height={40} fill={Colors.light.foreground} />

      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styling = ({
  full,
  borderRadius = { tl: 0, tr: 0, bl: 0, br: 0 },
}: customStyles) => {
  const { tl, tr, bl, br } = borderRadius;

  return StyleSheet.create({
    option: {
      backgroundColor: Colors.light.mainBackground,
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
