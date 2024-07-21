import { StyleSheet, Text, View } from "react-native";
import { faBars, faPen } from "@fortawesome/free-solid-svg-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import IconButton from "./IconButton";
import { Colors } from "@/constants/Colors";
import { useContext } from "react";
import { AppContext } from "@/state/AppProvider";

function Header() {
  const { state } = useContext(AppContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <IconButton
        onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
        icon={faBars}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overall balance</Text>
        <Text style={[styles.title, styles.balance]}>{state.overallBalance.balance + " " + state.settings.formatting.mainCurrency.code}</Text>
      </View>

      <IconButton icon={faPen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 11,
    paddingTop: 8,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: Colors.light.foreground,
    fontFamily: "Inter-Regular",
  },
  balance: {
    fontSize: 28,
  },
});

export default Header;
