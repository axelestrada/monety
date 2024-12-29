import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import IconButton from "@/components/ui/IconButton";
import { IAccount, ICategory, ITransaction } from "@/interfaces";
import { Octicons } from "@expo/vector-icons";
import { useLocalSearchParams, useSegments } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewTransaction from "@/components/NewTransaction";
import { useAccounts, useCategories, useTransactions } from "@/hooks";
import { useTypedSelector } from "@/store";
import AccountCategorySelector from "@/components/AccountCategorySelector";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "react-native-ui-datepicker";
import moment from "moment";

function Categories() {
  const params: {
    type?: "Income" | "Expense";
  } = useLocalSearchParams();

  const [type, setType] = useState<"Income" | "Expense">(
    params.type || "Expense"
  );
  const [activeModal, setActiveModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [activeSelector, setActiveSelector] = useState<
    "Accounts" | "Categories" | ""
  >("");
  const [elementType, setElementType] = useState<"from" | "to">("from");

  const {
    categories,
    loadCategories,
  }: { categories: ICategory[]; loadCategories: () => Promise<void> } =
    useCategories();
  const { accounts, loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { transactions }: { transactions: ITransaction[] } = useTypedSelector(
    (state) => state.transactions
  );
  const { loading } = useTypedSelector((state) => state.userPreferences);

  const [transactionDetails, setTransactionDetails] = useState<{
    from: ICategory | IAccount;
    to: ICategory | IAccount;
  }>({
    from: accounts[0],
    to: categories[0],
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().unix());

  const { colorScheme } = useColorScheme();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts();
    loadTransactions();
    loadCategories();
    setRefreshing(false);
  }, [setRefreshing, loadTransactions, loadAccounts, loadCategories]);

  return (
    <SafeAreaView className="flex flex-1 bg-light-background dark:bg-[#0D0D0D]">
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "light" ? "#FFFFFF" : "#0D0D0D"}
      />

      <Modal
        visible={activeModal}
        onRequestClose={() => setActiveModal(false)}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <NewTransaction
          showModal={() => {
            setActiveModal(true);
            setSelectedDate(moment().unix());
          }}
          hideModal={() => {
            setActiveModal(false);
            setSelectedDate(moment().unix());
          }}
          openDateTimePicker={() => setShowDateTimePicker(true)}
          openSelector={(
            type: "" | "Accounts" | "Categories",
            elementType: "from" | "to"
          ) => {
            setElementType(elementType);
            setActiveSelector(type);
          }}
          from={transactionDetails.from}
          to={transactionDetails.to}
          selectedDate={selectedDate}
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
            <View className="rounded-t-3xl overflow-hidden bg-light-background dark:bg-[#121212]">
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

      <Modal
        visible={showDateTimePicker}
        onRequestClose={() => {
          setShowDateTimePicker(false);
        }}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <View className="flex-[1] bg-[#00000080] justify-center items-center">
          <View className="bg-white mx-3 rounded-2xl p-2">
            <DateTimePicker
              mode="single"
              date={selectedDate * 1000}
              onChange={({ date }) => {
                setSelectedDate(moment(date?.toString()).unix());
              }}
              timePicker
            />
          </View>
        </View>
      </Modal>

      <Header overallBalance dateRange />

      <CategoriesGrid
        type={type}
        setType={setType}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"]}
            progressBackgroundColor={
              colorScheme === "dark" ? "#1B1D1C" : "#FFFFFF"
            }
          />
        }
        categories={categories.filter((item) => item.type === type)}
        openModal={() => {
          setActiveModal(true);
          setSelectedDate(moment().unix());
        }}
        setCurrentCategory={(category: ICategory) => {
          setTransactionDetails((prev) =>
            category.type === "Income"
              ? {
                  from: category,
                  to: accounts[0],
                }
              : {
                  from: accounts[0],
                  to: category,
                }
          );
        }}
      />

      <BottomTabNavigator />
    </SafeAreaView>
  );
}

export default Categories;
