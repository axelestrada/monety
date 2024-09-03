import BottomTabNavigator from "@/components/BottomTabNavigator";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { IAccount } from "@/interfaces/account";
import { styles } from "@/styles/shadow";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Accounts = () => {
  const [accounts, setAccounts] = useState<IAccount[]>([]);

  const db = useSQLiteContext();
  const segments = useSegments();

  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await db.getAllAsync<IAccount>(
          `
        SELECT * FROM Accounts;
        `
        );

        setAccounts([
          ...result,
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Regular",
            currentBalance: 0,
          },
          {
            id: "",
            name: "",
            icon: "accessibility-outline",
            color: "623387",
            type: "Savings",
            currentBalance: 0,
          },
        ]);

        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    if (segments[0] === "accounts") {
      fetchData();
    }
  }, [segments]);

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Header title="Accounts">
        <IconButton>
          <Ionicons name="add" size={24} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView className="flex flex-1">
        <View className="mx-4 flex-row justify-between items-center mb-4">
          <Text className="text-main font-[Rounded-Bold] text-lg">
            Accounts
          </Text>
          <Text className="text-main font-[Rounded-Bold] text-lg">L 1,250</Text>
        </View>

        <FlatList
          data={accounts.filter((account) => account.type === "Regular")}
          scrollEnabled={false}
          renderItem={({ item }) =>
            item.id === "" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                className="mx-4 rounded-2xl justify-center items-center py-6"
                style={{
                  width: windowWidth - 32,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: "#1B1D1C",
                }}
              >
                <Feather name="plus" color={"#1B1D1C"} size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                className="bg-white p-4 mb-4 mx-4 rounded-2xl flex flex-row justify-between items-center"
                style={styles.shadow}
              >
                <View className="flex flex-row items-center">
                  <View
                    className={`justify-center items-center p-4 mr-2 rounded-full`}
                    style={{ backgroundColor: "#" + item.color + "1A" }}
                  >
                    <Ionicons
                      name={item.icon}
                      color={"#" + item.color}
                      size={18}
                    />
                  </View>

                  <View>
                    <Text className="font-[Rounded-Bold] text-lg text-main">
                      {item.name}
                    </Text>

                    <Text className="font-[Rounded-Regular] text-sm text-main-500">
                      {"L " + item.currentBalance}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
        />

        {accounts.filter((account) => account.type === "Savings").length >
          1 && (
          <>
            <View className="mx-4 flex-row justify-between items-center my-4">
              <Text className="text-main font-[Rounded-Bold] text-lg">
                Savings
              </Text>
              <Text className="text-main font-[Rounded-Bold] text-lg">L 0</Text>
            </View>

            <FlatList
              data={accounts.filter((account) => account.type === "Savings")}
              scrollEnabled={false}
              renderItem={({ item }) =>
                item.id === "" ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    className="mx-4 rounded-2xl justify-center items-center py-6"
                    style={{
                      width: windowWidth - 32,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderColor: "#1B1D1C",
                    }}
                  >
                    <Feather name="plus" color={"#1B1D1C"} size={20} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    className="bg-white p-4 mb-4 mx-4 rounded-2xl flex flex-row justify-between items-center"
                    style={styles.shadow}
                  >
                    <View className="flex flex-row items-center">
                      <View
                        className={`justify-center items-center p-4 mr-2 rounded-full`}
                        style={{ backgroundColor: "#" + item.color + "1A" }}
                      >
                        <Ionicons
                          name={item.icon}
                          color={"#" + item.color}
                          size={18}
                        />
                      </View>

                      <View>
                        <Text className="font-[Rounded-Bold] text-lg text-main">
                          {item.name}
                        </Text>

                        <Text className="font-[Rounded-Regular] text-sm text-main-500">
                          {"L " + item.currentBalance}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            />
          </>
        )}
      </ScrollView>

      <BottomTabNavigator />
    </SafeAreaView>
  );
};

export default Accounts;
