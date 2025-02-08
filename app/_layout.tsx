import { SplashScreen, Stack, Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

import "../global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

import { PortalProvider } from "@gorhom/portal";

export default function Layout() {
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="monety.db">
          <ThemeProvider>
            <PortalProvider>
              <Stack screenOptions={{
                headerShown: false
              }}>

                <Stack.Screen
                  name="(drawer)"
                />
              </Stack>
            </PortalProvider>
          </ThemeProvider>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
