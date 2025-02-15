import { CustomText } from "@/components/CustomText";
import Header from "@/components/Header/Header";
import MainContainer from "@/components/MainContainer";
import Screen from "@/components/Screen";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import { normalizeCategory } from "@/features/categories/normalizers/normalizeCategory";
import { categoriesServices } from "@/features/categories/redux/reducers/categoriesSlice";
import ICategory from "@/features/categories/types/category";
import useThemeColors from "@/hooks/useThemeColors";
import { useAppDispatch, useTypedSelector } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import moment from "moment";
import { useColorScheme } from "nativewind";
import { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { parse } from "react-native-svg";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function Accounts() {
  const themeColors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const db = useSQLiteContext();
  const dispatch = useAppDispatch();

  const { accounts } = useTypedSelector((state) => state.accounts);

  const [account, setAccount] = useState({
    name: "",
    description: "",
    color: "",
    icon: "",
    type: "regular",
    currentBalance: "0",
    includeInOverallBalance: "0",
  });

  const handleSubmit = useCallback(async () => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO Accounts (name, description, icon, color, type, current_balance, include_in_totals) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [
            account.name,
            account.description || "",
            parseInt(account.icon),
            parseInt(account.color),
            account.type,
            parseFloat(account.currentBalance),
            parseInt(account.includeInOverallBalance),
          ],
        );

        const accounts = await db.getAllAsync<any>("SELECT * FROM Accounts;");

        dispatch(
          accountsServices.actions.setAccounts(
            accounts.map((account) => normalizeAccount(account)),
          ),
        );

        setAccount({
          name: "",
          description: "",
          color: "",
          icon: "",
          type: "regular",
          currentBalance: "0",
          includeInOverallBalance: "0",
        });
      });
    } catch (error) {
      console.error("Error inserting account: ", error);
      alert("Error inserting account");
    }
  }, [account]);

  return (
    <Screen showBottomNavigationBar pathname="/categories">
      <Header title="Categories" drawer showDateRange overallBalance></Header>

      <MainContainer>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          className="bg-main-background pb-4 relative"
        >
          {accounts.map((account) => (
            <View key={"Account" + account.id} className="m-3">
              <Text className="text-text-primary">Id: {account.id}</Text>
              <Text className="text-text-primary">Name: {account.name}</Text>
              <Text className="text-text-primary">
                CurrentBalance: {account.currentBalance}
              </Text>
              <Text className="text-text-primary">
                Description: {account.description}
              </Text>
              <Text className="text-text-primary">Color: {account.color}</Text>
              <Text className="text-text-primary">Icon: {account.icon}</Text>
              <Text className="text-text-primary">Type: {account.type}</Text>
              <Text className="text-text-primary">
                IncludeInOverallBalance: {account.includeInOverallBalance}
              </Text>
            </View>
          ))}

          <View className="m-5">
            <View className="mx-3">
              <Text className="text-text-primary">Name: {account.name}</Text>
              <Text className="text-text-primary">
                CurrentBalance: {account.currentBalance}
              </Text>
              <Text className="text-text-primary">
                Description: {account.description}
              </Text>
              <Text className="text-text-primary">Color: {account.color}</Text>
              <Text className="text-text-primary">Icon: {account.icon}</Text>
              <Text className="text-text-primary">Type: {account.type}</Text>
              <Text className="text-text-primary">
                IncludeInOverallBalance: {account.includeInOverallBalance}
              </Text>
            </View>

            <TextInput
              placeholder="Name"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.name}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              placeholder="Description"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.description}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, description: text }))
              }
            />

            <TextInput
              placeholder="CurrentBalance"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.currentBalance}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, currentBalance: text }))
              }
            />

            <TextInput
              placeholder="Color"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.color}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, color: text }))
              }
            />

            <TextInput
              placeholder="Icon"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.icon}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, icon: text }))
              }
            />

            <TextInput
              placeholder="Type"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.type}
              onChangeText={(text) =>
                setAccount((prev) => ({ ...prev, type: text }))
              }
            />

            <TextInput
              placeholder="IncludeInOverallBalance"
              className="bg-card-background m-3 p-3 text-text-primary"
              value={account.includeInOverallBalance}
              onChangeText={(text) =>
                setAccount((prev) => ({
                  ...prev,
                  includeInOverallBalance: text,
                }))
              }
            />

            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </Animated.ScrollView>
      </MainContainer>
    </Screen>
  );
}
