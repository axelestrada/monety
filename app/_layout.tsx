import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "../store";
import { Provider } from "react-redux";

export default function Layout() {
  return (
    
      <Provider store={store}>
        <SQLiteProvider databaseName="todos.db">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="accounts" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="add-category" />
            <Stack.Screen name="add-account" />
            <Stack.Screen name="transactions" />
          </Stack>
        </SQLiteProvider>
      </Provider>
    
  );
}
