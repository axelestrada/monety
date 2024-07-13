import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";
import CustomDrawer from "@/components/Drawer";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: "transparent", width: "85%" },
        }}
        drawerContent={CustomDrawer}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: "Categories" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
