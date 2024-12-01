import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

import "../global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="todos.db">
          <ThemeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </ThemeProvider>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
