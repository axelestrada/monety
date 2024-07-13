import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import HeaderAction from "./HeaderAction";

function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderAction onPress={() => navigation.dispatch(DrawerActions.openDrawer)} icon={faBars}/>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overall balance</Text>
        <Text style={styles.balance}>716 HNL</Text>
      </View>

      <HeaderAction onPress={() => {}} icon={faPlus}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter-Regular",
  },
  balance: {
    fontFamily: "Inter-Regular",
    fontSize: 28,
  },
});

export default Header;
