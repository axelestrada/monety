import { SplashScreen, Stack, Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

import "../global.css";
import { ThemeProvider } from "@/shared-components/providers/ThemeProviders";

import { PortalProvider } from "@gorhom/portal";

import useLoadFonts from "@/hooks/useLoadFonts";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [error, loaded] = useLoadFonts();

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SQLiteProvider databaseName="monety.db">
          <ThemeProvider>
            <PortalProvider>
              <Stack>
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </PortalProvider>
          </ThemeProvider>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
