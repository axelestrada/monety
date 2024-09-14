import AccountCategorySelector from "@/components/AccountCategorySelector";
import BottomTabNavigator from "@/components/BottomTabNavigator";
import Header from "@/components/Header";
import NewTransaction from "@/components/NewTransaction";
import OverallBalance from "@/components/OverallBalance";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { useAccounts } from "@/hooks";
import { IAccount, ICategory } from "@/interfaces";
import { accountsServices } from "@/reducers/accountsSlice";
import { useAppDispatch, useTypedSelector } from "@/store";
import { styles } from "@/styles/shadow";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accounts() {
  const { accounts } = useAccounts();

  const [activeModal, setActiveModal] = useState(false);
  const [activeSelector, setActiveSelector] = useState<
    "" | "Accounts" | "Categories"
  >("");

  const [transactionDetails, setTransactionDetails] = useState<{
    from: ICategory | IAccount;
    to: ICategory | IAccount;
  }>({
    from: accounts[0],
    to: accounts[1],
  });

  const [elementType, setElementType] = useState<"from" | "to">("to");

  const windowWidth = Dimensions.get("window").width;

  const router = useRouter();

  const format = (number: number) => {
    const formattedNumber = Intl.NumberFormat("en-US").format(number);

    if (number < 0) {
      return "- L " + formattedNumber.toString().slice(1);
    }

    if (number >= 0) {
      return "L " + formattedNumber;
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      <Modal
        visible={activeModal}
        onRequestClose={() => setActiveModal(false)}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <NewTransaction
          hideModal={() => setActiveModal(false)}
          openSelector={(
            type: "" | "Accounts" | "Categories",
            elementType: "from" | "to"
          ) => {
            setElementType(elementType);
            setActiveSelector(type);
          }}
          from={transactionDetails.from}
          to={transactionDetails.to}
        />
      </Modal>

      <Modal
        visible={activeSelector !== ""}
        onRequestClose={() => setActiveSelector("")}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity
          className="flex-[1] pt-24 justify-end bg-[#00000080]"
          activeOpacity={1}
          onPress={() => setActiveSelector("")}
        >
          <TouchableWithoutFeedback>
            <View className="rounded-t-3xl overflow-hidden bg-white">
              <BackgroundGradient />

              <AccountCategorySelector
                type={activeSelector || "Categories"}
                hideModal={() => setActiveSelector("")}
                elementType={elementType}
                setTransactionDetails={(transaction: {
                  from?: ICategory | IAccount;
                  to?: ICategory | IAccount;
                }) =>
                  setTransactionDetails((prev) => ({ ...prev, ...transaction }))
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <Header title="Accounts">
        <IconButton>
          <Ionicons name="add" size={24} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance />

      <ScrollView className="flex flex-1">
        <View className="mx-3 flex-row justify-between items-center mb-3">
          <Text className="text-main font-[Rounded-Bold] text-lg">
            Accounts
          </Text>
          <Text className="text-main font-[Rounded-Bold] text-lg">
            {format(
              accounts.reduce((acc, curr) => acc + curr.currentBalance, 0)
            )}
          </Text>
        </View>

        <FlatList
          data={accounts.filter((account) => account.type === "Regular")}
          scrollEnabled={false}
          renderItem={({ item }) =>
            item.id === "" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                className="mx-3 rounded-2xl justify-center items-center py-5"
                onPress={() => {
                  router.navigate("/add-account");
                }}
                style={{
                  width: windowWidth - 24,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: "#1B1D1C",
                }}
              >
                <Feather name="plus" color={"#1B1D1C"} size={18} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                className="bg-white px-2 py-3 mb-3 mx-3 rounded-2xl flex flex-row justify-between items-center"
                style={styles.shadow}
                onPress={() => {
                  setActiveModal(true)
                }}
                onLongPress={() => {
                  router.push({
                    pathname: "/add-account",
                    params: {
                      id: item.id,
                    },
                  });
                }}
              >
                <View className="flex flex-row items-center">
                  <View
                    className={`justify-center items-center p-3.5 mr-1.5 rounded-full`}
                    style={{ backgroundColor: "#" + item.color + "1A" }}
                  >
                    <Ionicons
                      name={item.icon}
                      color={"#" + item.color}
                      size={16}
                    />
                  </View>

                  <View>
                    <Text className="font-[Rounded-Medium] text-lg text-main">
                      {item.name}
                    </Text>

                    <Text
                      className={`font-[Rounded-Regular] text-base ${
                        item.currentBalance < 0 ? "text-red" : "text-main-500"
                      }`}
                    >
                      L{" "}
                      {Intl.NumberFormat("en-US")
                        .format(item.currentBalance)
                        .replace("-", "")}
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
                    activeOpacity={0.75}
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
}
