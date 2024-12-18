import BottomTabNavigator from "@/components/BottomTabNavigator";
import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// for exporting data to CSV
import * as FileSystem from "expo-file-system";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

const Statistics = () => {
  const db = useSQLiteContext();
  const tables = ["Accounts", "Categories", "Transactions"];

  return (
    <SafeAreaView className="flex-[1] bg-white dark:bg-[#0D0D0D]">
      <View className="flex-[1]">
        <Text className="text-center text-3xl text-[Rounded-Bold] my-4">
          Statistics
        </Text>

        <Button
          title="Crear copia de seguridad"
          onPress={() => {
            exportDataToCSV(db, tables);
          }}
        />
      </View>

      <BottomTabNavigator />
    </SafeAreaView>
  );
};

const exportDataToCSV = async (db: SQLiteDatabase, tables: string[]) => {
  try {
    let csvContent = "\uFEFF";

    for (const table of tables) {
      // get all data from the table
      const result = await db.getAllAsync<any>(`SELECT * FROM ${table}`);

      if (result.length > 0) {
        // get the columns of the table
        const columns = Object.keys(result[0]);
        const header = `Table: ${table}\n${columns.join(",")}`;

        // get the data of the table
        const tableData = result.map((row) => {
          return columns.map((column) => row[column]).join(",");
        }).join("\n");

        // add the header and data to the CSV content
        csvContent += `${header}\n${tableData}\n\n`;
      }
    }

    // write the CSV content to a file
    const uri = FileSystem.documentDirectory + "monety_backup.csv";
    await FileSystem.writeAsStringAsync(uri, csvContent);

    console.log("Data exported to CSV", uri);
    return uri;
  } catch (error) {
    console.error("Error exporting data to CSV", error);
    return null;
  }
};

export default Statistics;
