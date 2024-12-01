import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

import "../global.css";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="todos.db">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}