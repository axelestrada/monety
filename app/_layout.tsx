import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

import "../global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

import { DateRangePickerProvider } from "@/context/DateRangePickerContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="monety.db">
          <ThemeProvider>
            <DateRangePickerProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </DateRangePickerProvider>
          </ThemeProvider>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
