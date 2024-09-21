import BottomTabNavigator from "@/components/BottomTabNavigator";
import CashFlowItem from "@/components/CashFlowItem";
import CategoriesGrid from "@/components/CategoriesGrid";
import Header from "@/components/Header";
import OverallBalance from "@/components/OverallBalance";
import TimeRange from "@/components/TimeRange";
import BackgroundGradient from "@/components/ui/BackgroundGradient";
import IconButton from "@/components/ui/IconButton";
import { IAccount, ICategory } from "@/interfaces";
import { Octicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  StatusBar,
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

function Categories() {
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [activeModal, setActiveModal] = useState(false);
  const [activeSelector, setActiveSelector] = useState<
    "Accounts" | "Categories" | ""
  >("");
  const [elementType, setElementType] = useState<"from" | "to">("from");

  const { categories, loadCategories } = useCategories();
  const { accounts, loadAccounts } = useAccounts();
  const { loadTransactions } = useTransactions();
  const { transactions } = useTypedSelector((state) => state.transactions);
  const { loading } = useTypedSelector((state) => state.userPreferences);

  const [transactionDetails, setTransactionDetails] = useState<{
    from: ICategory | IAccount;
    to: ICategory | IAccount;
  }>({
    from: accounts[0],
    to: categories[0],
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts();
    loadTransactions();
    loadCategories();
    setRefreshing(false);
  }, [setRefreshing, loadTransactions, loadAccounts, loadCategories]);


  return (
    <SafeAreaView className="flex flex-1">
      <BackgroundGradient />

      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-[#00000080] justify-center items-center">
          <ActivityIndicator color={"#FFFFFF"} size={32} />
        </View>
      )}

      <Modal
        visible={activeModal}
        onRequestClose={() => setActiveModal(false)}
        animationType="slide"
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <NewTransaction
          showModal={() => setActiveModal(true)}
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

      <Header title="Categories">
        <IconButton>
          <Octicons name="pencil" size={20} color="#1B1D1C" />
        </IconButton>
      </Header>

      <OverallBalance>
        <TimeRange/>
      </OverallBalance>

      <View className="flex flex-row mx-3 py-1.5 bg-[#ffffff80] rounded-2xl">
        <CashFlowItem
          type="Incomes"
          value={transactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((acc, curr) => acc + curr.amount, 0)}
          active={type === "Income"}
          onPress={() => setType("Income")}
        />

        <CashFlowItem
          type="Expenses"
          value={transactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((acc, curr) => acc + curr.amount, 0)}
          active={type === "Expense"}
          onPress={() => setType("Expense")}
        />
      </View>

      <CategoriesGrid
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1B1D1C"]}
            progressBackgroundColor={"#FFFFFF"}
          />
        }
        categories={categories.filter((item) => item.type === type)}
        openModal={() => setActiveModal(true)}
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
