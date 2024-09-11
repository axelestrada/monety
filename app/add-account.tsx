import Header from "@/components/Header";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { IAccount, ICategory } from "@/interfaces";
import { styles } from "@/styles/shadow";
import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
  RouteParams,
  useGlobalSearchParams,
} from "expo-router";
import React, { useState } from "react";
import uuid from "react-native-uuid";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useCategories } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import { categoriesServices } from "@/reducers/categoriesSlice";
import { LinearGradient } from "expo-linear-gradient";
import { LocalRouteParamsContext } from "expo-router/build/Route";
import { accountsServices } from "@/reducers/accountsSlice";

const AddAccount = () => {
  const params: {
    id: string;
  } = useLocalSearchParams();

  const { accounts } = useTypedSelector((state) => state.accounts);

  const [account, setAccount] = useState<IAccount>(
    accounts.find((account) => account.id === params.id) || {
      id: "",
      name: "",
      description: "",
      icon: "accessibility-outline",
      color: "623387",
      currentBalance: 0,
      includeInOverallBalance: 1,
      type: "Regular",
    }
  );

  const db = useSQLiteContext();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [balance, setBalance] = useState(
    account.currentBalance.toString() || ""
  );

  const saveCategory = async () => {
    const {
      name,
      icon,
      color,
      description,
      currentBalance,
      includeInOverallBalance,
      type,
    } = account;

    if (name === "") return;

    const id = params.id || uuid.v4().toString();

    try {
      if (params.id) {
        await db.runAsync(
          `
        UPDATE Accounts SET name = ?, description = ?, icon = ?, color = ?, type = ?, currentBalance = ?, includeInOverallBalance = ? WHERE id = ?;
      `,
          [
            name,
            description,
            icon,
            color,
            type,
            currentBalance,
            includeInOverallBalance,
            id,
          ]
        );

        dispatch(
          accountsServices.actions.updateAccount({
            id,
            name,
            description,
            icon,
            color,
            type,
            currentBalance,
            includeInOverallBalance,
          })
        );
      } else {
        await db.runAsync(
          `
        INSERT INTO Accounts (id, name, description, icon, color, type, currentBalance, includeInOverallBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
          [
            id,
            name,
            description,
            icon,
            color,
            type,
            currentBalance,
            includeInOverallBalance ? 1 : 0,
          ]
        );

        dispatch(
          accountsServices.actions.addAccount({
            id,
            name,
            description,
            icon,
            color,
            type,
            currentBalance,
            includeInOverallBalance,
          })
        );
      }

      setAccount((prev) => ({ ...prev, id: "", name: "", description: "" }));

      router.back();
    } catch (error) {
      console.error();
    }
  };

  const deleteAccount = async () => {
    try {
      if (params.id) {
        await db.runAsync(
          `
          DELETE FROM Accounts WHERE id = ?;
          `,
          params.id
        );
      }

      dispatch(accountsServices.actions.deleteAccount(params.id));

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const itemSize = (windowWidth - 12 * 6) / 5;

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Header title={params.id ? "Edit Account" : "New Account"} goBack />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-row justify-between bg-[#ffffff33] mt-3 mx-3 py-1.5 rounded-2xl">
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setAccount((prev) => ({ ...prev, type: "Regular" }))}
            className={`${
              account.type === "Regular" && "bg-white"
            } flex flex-1 rounded-2xl p-3.5 mx-1.5 flex-row items-center justify-center`}
            style={account.type === "Regular" ? styles.shadow : {}}
          >
            <Text className="text-main font-[Rounded-Bold] text-base">
              Regular
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setAccount((prev) => ({ ...prev, type: "Savings" }))}
            className={`${
              account.type === "Savings" && "bg-white"
            } flex flex-1 rounded-2xl p-3.5 mx-1.5 flex-row items-center justify-center`}
            style={account.type === "Savings" ? styles.shadow : {}}
          >
            <Text className="text-main font-[Rounded-Bold] text-base">
              Savings
            </Text>
          </TouchableOpacity>
        </View>

        <View className="grow" style={{ minHeight: windowHeight - 235 }}>
          <View className="mx-3 mt-3">
            <Text className="font-[Rounded-Medium] text-base mb-2">
              Account name
            </Text>
            <TextInput
              value={account.name}
              placeholder="Enter account name"
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, name: text }))
              }
              className="bg-white rounded-lg p-3 text-base"
              style={{ fontFamily: "Rounded-Medium", ...styles.shadow }}
            />
          </View>

          <View className="mx-3 mt-3">
            <Text className="font-[Rounded-Medium] text-base mb-2">
              Description
            </Text>

            <TextInput
              value={account.description}
              placeholder="-----"
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, description: text }))
              }
              className="bg-white rounded-lg p-3 text-base"
              style={{ fontFamily: "Rounded-Medium", ...styles.shadow }}
            />
          </View>

          <View className="mx-1.5 mt-3 -mb-4">
            <Text className="font-[Rounded-Medium] text-base mx-1.5 mb-2">
              Choose icon
            </Text>

            <FlatList
              data={icons.slice(0, -5).map((icon, index) => ({
                id: index,
                name: icon,
              }))}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={item.id + item.name}
                  onPress={() =>
                    setAccount((prev) => ({ ...prev, icon: item.name }))
                  }
                  className={`${
                    account.icon === item.name ? "bg-white" : "bg-[#FFFFFF33]"
                  } rounded-lg p-3 mb-3 mx-1.5 justify-center items-center`}
                  style={[
                    { width: itemSize, height: itemSize },
                    account.icon === item.name ? styles.shadow : {},
                  ]}
                >
                  <Ionicons name={item.name} size={28} color="#1B1D1C" />
                </TouchableOpacity>
              )}
              numColumns={5}
              columnWrapperStyle={{
                flex: 1,
                justifyContent: "space-between",
              }}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>

          <View className="mx-1.5">
            <Text className="font-[Rounded-Medium] text-base mx-1.5 mb-2">
              Choose color
            </Text>
            <FlatList
              data={colors.map((color, index) => ({
                id: index,
                code: color,
              }))}
              contentContainerStyle={{ paddingBottom: 16 }}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={item.id + item.code}
                  onPress={() =>
                    setAccount((prev) => ({ ...prev, color: item.code }))
                  }
                  className={`${
                    account.color === item.code ? "bg-white" : "bg-[#FFFFFF33]"
                  } rounded-lg p-3 mx-1.5 justify-center items-center`}
                  style={[
                    { width: itemSize, height: itemSize },
                    account.color === item.code ? styles.shadow : {},
                  ]}
                >
                  <View
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: "#" + item.code }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>

          <View className="mx-3">
            <Text className="font-[Rounded-Medium] text-base mb-2">
              Current Balance
            </Text>

            <TextInput
              value={
                "L " +
                balance.split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                (balance.includes(".") ? "." + balance.split(".")[1] : "")
              }
              keyboardType="number-pad"
              placeholder="0"
              onChangeText={(text) => {
                setBalance(text.replace("L ", ""));
              }}
              className="bg-white rounded-lg p-3 text-base"
              style={{
                fontFamily: "Rounded-Medium",
                ...styles.shadow,
                fontWeight: "normal",
              }}
            />
          </View>

          <View
            className="bg-white rounded-lg mx-3 my-4 p-2.5 flex-row justify-between items-center"
            style={styles.shadow}
          >
            <Text className="font-[Rounded-Medium] text-base">
              Include in overall balance
            </Text>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                setAccount((prev) => ({
                  ...prev,
                  includeInOverallBalance:
                    prev.includeInOverallBalance === 1 ? 0 : 1,
                }))
              }
              className={`w-14 p-1 rounded-full border-2 border-mai ${
                account.includeInOverallBalance
                  ? "bg-main items-end"
                  : "items-start"
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full ${
                  account.includeInOverallBalance ? "bg-white" : "bg-main"
                }`}
              ></View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={saveCategory}
          className="bg-main mx-3 mb-3 mt-6 rounded-2xl p-4 py-5"
          style={styles.shadow}
        >
          <Text
            className="text-white text-center font-[Rounded-Medium] text-base"
            style={styles.shadow}
          >
            {params.id ? "Update account" : "Create new account"}
          </Text>
        </TouchableOpacity>

        {params.id && (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              className="bg-white mx-3 mb-3 rounded-2xl p-4 py-5"
              style={styles.shadow}
            >
              <Text
                className="text-main text-center font-[Rounded-Medium] text-base"
                style={styles.shadow}
              >
                Move to archive
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={deleteAccount}
              className="bg-[#E93043] mx-3 mb-3 rounded-2xl p-4 py-5"
              style={styles.shadow}
            >
              <Text
                className="text-white text-center font-[Rounded-Medium] text-base"
                style={styles.shadow}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAccount;
