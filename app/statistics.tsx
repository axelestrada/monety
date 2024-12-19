import BottomTabNavigator from "@/components/BottomTabNavigator";
import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// for exporting data to CSV
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
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
    let csvContent = "";

    for (const table of tables) {
      // get all data from the table
      const result = await db.getAllAsync<any>(`SELECT * FROM ${table}`);

      if (result.length > 0) {
        // get the columns of the table
        const columns = Object.keys(result[0]);
        const header = `Table: ${table}\n${columns.join(",")}`;

        // get the data of the table
        const tableData = result
          .map((row) => {
            return columns.map((column) => row[column]).join(",");
          })
          .join("\n");

        // add the header and data to the CSV content
        csvContent += `${header}\n${tableData}\n\n`;
      }
    }

    // save the CSV content to Downloads
    await saveCSVToDownloads(csvContent);
  } catch (error) {
    console.error("Error exporting data to CSV", error);

    alert("Error exporting data to CSV " + error);
    return null;
  }
};

const saveCSVToDownloads = async (csvContent: string) => {
  try {
    // Define el nombre del archivo
    const fileName = "monety_backup.csv";

    // Ruta temporal para almacenar el archivo CSV
    const tempFileUri = `${FileSystem.cacheDirectory}${fileName}`;

    // Escribe el contenido del archivo CSV en la ubicación temporal
    await FileSystem.writeAsStringAsync(tempFileUri, "\uFEFF" + csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Solicitar permisos para acceder a la carpeta Descargas
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      alert("No se han otorgado permisos para acceder al almacenamiento");
      console.error(
        "No se han otorgado permisos para acceder al almacenamiento"
      );
      return;
    }

    try {
      await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, "text/csv").then(async(uri) => {
        await FileSystem.writeAsStringAsync(uri, "\uFEFF" + csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        alert("Archivo CSV guardado en " + uri);
        console.log("Archivo CSV guardado en", uri);
      }).catch((error) => {
        alert("Error al guardar el archivo CSV en Descargas: " + error);
        console.error("Error al guardar el archivo CSV en Descargas:", error);});
    } catch (error) {
      alert("Error al guardar el archivo CSV en Descargas: " + error);
      console.error("Error al guardar el archivo CSV en Descargas:", error);
    }

    alert("Archivo CSV guardado en " + tempFileUri);
    console.log("Archivo CSV guardado en", tempFileUri);
  } catch (error) {
    alert("Error al guardar el archivo CSV en Descargas: " + error);
    console.error("Error al guardar el archivo CSV en Descargas:", error);
  }
};

export default Statistics;
