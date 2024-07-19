import { StyleSheet, Text, View } from "react-native";
import { faBars, faPen } from "@fortawesome/free-solid-svg-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import IconButton from "./IconButton";
import { Colors } from "@/constants/Colors";

function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <IconButton
        onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
        icon={faBars}
        iconColor={Colors.light.foreground}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overall balance</Text>
        <Text style={styles.balance}>0 HNL</Text>
      </View>

      <IconButton icon={faPen} iconColor={Colors.light.foreground}/>
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
    color: Colors.light.foreground,
    fontFamily: "Inter-Regular",
    fontSize: 28,
  },
});

export default Header;
