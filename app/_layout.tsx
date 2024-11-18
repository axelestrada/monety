import { Drawer } from "expo-router/drawer";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="todos.db">
          <Drawer
            screenOptions={{
              headerShown: false,
              drawerType: "front",
              lazy: false,
            }}
          >
            <Drawer.Screen name="index" />
            <Drawer.Screen name="accounts" />
            <Drawer.Screen name="add-account" />

            <Drawer.Screen name="add-category" />
            <Drawer.Screen name="categories" />
            <Drawer.Screen name="transactions" />
          </Drawer>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
