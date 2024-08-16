import { Todo } from "@/interfaces/todo";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState<string>("");

  const db = useSQLiteContext();

  useEffect(() => {
    const createTable = async () => {
      try {
        await db.execAsync("PRAGMA journal_mode = WAL");
        await db.execAsync("PRAGMA foreign_keys = ON");

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value TEXT NOT NULL
          );`);
      } catch (error) {
        console.error(error);
      }
    };

    createTable();
    getTodos();
  }, []);

  const getTodos = async () => {
    const result = await db.getAllAsync<Todo>(`SELECT * FROM Tasks;`);

    setTodos(result);
  };

  const addTodo = async () => {
    if (value === "") return;

    try {
      await db.runAsync(`INSERT INTO Tasks (value) VALUES (?)`, value);

      getTodos();
      setValue("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <Text className="text-2xl text-center">TODOS</Text>

      <View className="p-4">
        <TextInput
          className="border border-slate-500 rounded-md mb-2 py-1 px-2"
          value={value}
          onChangeText={(text) => setValue(text)}
        />
        <Button onPress={addTodo} title="SAVE" />
      </View>

      <View className="px-4">
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
              <Text>{item.id}</Text>
              <Text>{item.value}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Todos;
