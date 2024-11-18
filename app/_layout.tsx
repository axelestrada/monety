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
          <Drawer>
             <Drawer.Screen
                options={{
                  headerShown: false
                }}
                name="index" // This is the name of the page and must match the url from root
              />
              <Drawer.Screen
              options={{
                headerShown: false
              }}
                name="accounts" // This is the name of the page and must match the url from root
              />
              <Drawer.Screen
              options={{
                headerShown: false
              }}
                name="add-account" // This is the name of the page and must match the url from root
              />

              <Drawer.Screen
              options={{
                headerShown: false
              }}
                name="add-category" // This is the name of the page and must match the url from root
              />
              <Drawer.Screen
              options={{
                headerShown: false
              }}
                name="categories" // This is the name of the page and must match the url from root
              />
              <Drawer.Screen
              options={{
                headerShown: false
              }}
                name="transactions" // This is the name of the page and must match the url from root
              />
          </Drawer>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
