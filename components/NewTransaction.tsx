import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundGradient from "./ui/BackgroundGradient";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Header from "./Header";
import { styles } from "@/styles/shadow";
import { useState } from "react";
import { IAccount, ICategory } from "@/interfaces";
import { useCategories } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import { useSQLiteContext } from "expo-sqlite";
import uuid from "react-native-uuid";
import { transactionServices } from "@/reducers/transactionsSlice";
import moment from "moment";
import { accountsServices } from "@/reducers/accountsSlice";
import AccountCategorySelector from "./AccountCategorySelector";
import { useColorScheme } from "nativewind";

const NewTransaction = ({
  hideModal,
  showModal,
  openSelector,
  from,
  to,
}: {
  hideModal: () => void;
  showModal: () => void;
  openSelector: (
    type: "" | "Accounts" | "Categories",
    elementType: "from" | "to"
  ) => void;
  from: ICategory | IAccount;
  to: ICategory | IAccount;
}) => {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);

  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(timeRange.from);

  const [operator, setOperator] = useState<"+" | "-" | "÷" | "×" | "">("");
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");

  const [comment, setComment] = useState("");

  const db = useSQLiteContext();

  const windowWidth = Dimensions.get("window").width;

  const makeOperation = (
    operator: "+" | "-" | "÷" | "×" | "",
    equal: boolean
  ) => {
    if (operator === "") return;

    if (firstValue === "") {
      setFirstValue(secondValue === "" ? "0" : secondValue);
      setSecondValue("");
      return;
    }

    if (firstValue !== "" && secondValue === "") return;

    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(secondValue === "" ? "0" : secondValue);

    if (operator === "÷" && num2 === 0) {
      ToastAndroid.show("Can't divide by zero.", ToastAndroid.SHORT);

      return;
    }

    let result = 0;

    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "×":
        result = num1 * num2;
        break;
      case "÷":
        result = num1 / num2;
        break;
    }

    result = parseFloat(result.toFixed(2));

    if (equal) {
      setFirstValue("");
      setSecondValue(result.toString());
    } else {
      setFirstValue(result.toString());
      setSecondValue("");
    }

    setOperator("");
  };

  const formatDate = (date: number) => {
    const yesterday = moment().subtract(1, "day").startOf("day");
    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");
    const tomorrowEnd = moment().add(1, "day").endOf("day");

    if (date > tomorrowEnd.unix() || date < yesterday.unix()) {
      return moment(date * 1000).format("dddd, MMMM DD");
    }

    if (date >= tomorrow.unix()) {
      return "Tomorrow, " + moment(date * 1000).format("MMMM DD");
    }

    if (date >= today.unix()) {
      return "Today, " + moment(date * 1000).format("MMMM DD");
    }

    if (date >= yesterday.unix()) {
      return "Yesterday, " + moment(date * 1000).format("MMMM DD");
    }
  };

  const dispatch = useAppDispatch();

  const addIncome = async (category: ICategory, account: IAccount) => {
    setLoading(true);

    const id = uuid.v4().toString();

    const createdAt = selectedDate;
    const date = createdAt === timeRange.from ? moment().unix() : createdAt;

    const amount = parseFloat(secondValue);

    await Promise.all([
      db.runAsync(
        `INSERT INTO Transactions (id, category_id, account_id, created_at, date, amount, comment, type) VALUES (?, ?, ?, ?, ?, ?, ?, 'Income');`,
        [id, category.id, account.id, createdAt, date, amount, comment]
      ),

      db.runAsync(
        `
        UPDATE Accounts SET currentBalance = ? WHERE id = ?
      `,
        account.currentBalance + amount,
        account.id
      ),
    ])
      .then(() => {
        dispatch(
          transactionServices.actions.addTransaction({
            id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
            accountName: account.name,
            createdAt,
            accountId: account.id,
            date,
            amount,
            comment,
            type: "Income",
          })
        );

        dispatch(
          accountsServices.actions.incrementBalance({
            id: account.id,
            amount,
          })
        );

        hideModal();

        setComment("");
        setFirstValue("");
        setSecondValue("");
      })
      .catch((error) => {
        console.error(error);
      });

    setLoading(false);
  };

  const addExpense = async (account: IAccount, category: ICategory) => {
    setLoading(true);

    const id = uuid.v4().toString();

    const createdAt = selectedDate;
    const date = createdAt === timeRange.from ? moment().unix() : createdAt;

    const amount = parseFloat(secondValue);

    await Promise.all([
      db.runAsync(
        `INSERT INTO Transactions (id, category_id, account_id, created_at, date, amount, comment, type) VALUES (?, ?, ?, ?, ?, ?, ?, 'Expense');`,
        [id, category.id, account.id, createdAt, date, amount, comment]
      ),
      db.runAsync(
        `
        UPDATE Accounts SET currentBalance = ? WHERE id = ?
      `,
        account.currentBalance - amount,
        account.id
      ),
    ])
      .then(() => {
        dispatch(
          transactionServices.actions.addTransaction({
            id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
            accountName: account.name,
            accountId: account.id,
            createdAt,
            date,
            amount,
            comment,
            type: "Expense",
          })
        );

        dispatch(
          accountsServices.actions.decrementBalance({
            id: account.id,
            amount,
          })
        );

        hideModal();

        setComment("");
        setFirstValue("");
        setSecondValue("");
      })
      .catch((error) => {
        console.error(error);
      });

    setLoading(false);
  };

  const addTransfer = async (from: IAccount, to: IAccount) => {
    setLoading(true);
    const id = uuid.v4().toString();

    const createdAt = selectedDate;
    const date = createdAt === timeRange.from ? moment().unix() : createdAt;

    const amount = parseFloat(secondValue);

    await Promise.all([
      db.runAsync(
        `INSERT INTO Transactions (id, account_id, destination_account, created_at, date, amount, comment, type) VALUES (?, ?, ?, ?, ?, ?, ?, 'Transfer');`,
        [id, from.id, to.id, createdAt, date, amount, comment]
      ),

      db.runAsync(
        `
        UPDATE Accounts SET currentBalance = ? WHERE id = ?
      `,
        from.currentBalance - amount,
        from.id
      ),

      db.runAsync(
        `
        UPDATE Accounts SET currentBalance = ? WHERE id = ?
      `,
        to.currentBalance + amount,
        to.id
      ),
    ])
      .then(() => {
        dispatch(
          transactionServices.actions.addTransaction({
            id,
            destinationAccountId: to.id,
            destinationAccountColor: to.color,
            destinationAccountIcon: to.icon,
            destinationAccountName: to.name,
            accountName: from.name,
            accountId: from.id,
            createdAt,
            date,
            amount,
            comment,
            type: "Transfer",
          })
        );

        dispatch(
          accountsServices.actions.incrementBalance({
            id: to.id,
            amount,
          })
        );

        dispatch(
          accountsServices.actions.decrementBalance({
            id: from.id,
            amount,
          })
        );

        hideModal();

        setComment("");
        setFirstValue("");
        setSecondValue("");
      })
      .catch((error) => {
        console.error(error);
      });

    setLoading(false);
  };

  const formatNumber = (number: string) => {
    const formatter = Intl.NumberFormat("en-US");

    if (number.includes(".")) {
      return (
        formatter.format(Math.floor(parseFloat(number))) +
        "." +
        number.split(".")[1]
      );
    }

    return formatter.format(parseFloat(number));
  };

  const isAccount = (item: IAccount | ICategory) => "currentBalance" in item;

  const { colorScheme } = useColorScheme();

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-[#00000080] justify-center items-center">
          <ActivityIndicator color={"#FFFFFF"} size={32} />
        </View>
      )}
      <TouchableOpacity
        className="flex-[1] pt-24 justify-end bg-[#00000080]"
        activeOpacity={1}
        onPress={hideModal}
      >
        <TouchableWithoutFeedback>
          <View className="rounded-t-3xl overflow-hidden bg-white dark:bg-[#121212]">
            {colorScheme === "light" && <BackgroundGradient />}

            <ScrollView>
              <View className="flex-row mx-1 mt-4">
                {from && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      openSelector(
                        isAccount(from) ? "Accounts" : "Categories",
                        "from"
                      );
                    }}
                    className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-2 mx-1 flex-1"
                    style={{ ...styles.shadow }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`justify-center items-center p-3 mr-1.5 rounded-full`}
                        style={{ backgroundColor: "#" + from.color + "1A" }}
                      >
                        <Ionicons
                          name={from.icon}
                          color={"#" + from.color}
                          size={18}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          className="text-main dark:text-[#E0E2EE] font-[Rounded-Medium] text-lg"
                        >
                          {from.name}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-down"
                        color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
                        size={14}
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {to && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-2 mx-2 flex-1"
                    onPress={() => {
                      openSelector(
                        isAccount(to) ? "Accounts" : "Categories",
                        "to"
                      );
                    }}
                    style={{ ...styles.shadow }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`justify-center items-center p-3 mr-1.5 rounded-full`}
                        style={{ backgroundColor: "#" + to.color + "1A" }}
                      >
                        <Ionicons
                          name={to.icon}
                          color={"#" + to.color}
                          size={18}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          className="text-main dark:text-[#E0E2EE] font-[Rounded-Medium] text-lg"
                        >
                          {to.name}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-down"
                        color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
                        size={14}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View className="py-8 justify-center items-center">
                <Text className="text-main dark:text-[#E0E2EE] font-[Rounded-Bold] text-4.5xl">
                  {operator === ""
                    ? "L " +
                      (secondValue !== "" ? formatNumber(secondValue) : "0")
                    : "L " +
                      (firstValue !== "" ? formatNumber(firstValue) : "0") +
                      " " +
                      operator +
                      " " +
                      (secondValue !== ""
                        ? "L " + formatNumber(secondValue)
                        : "")}
                </Text>
              </View>

              <View className="bg-[#FFFFFF80] dark:bg-[#1E1E1E] rounded-3xl">
                <TextInput
                  className="text-center mt-4 font-[Rounded-Medium] text-base text-main dark:text-[#E0E2EE]"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#E0E2EE80" : "#1B1D1C80"
                  }
                  placeholder="Add comment..."
                  value={comment}
                  onChangeText={(value) => setComment(value)}
                />

                <View className=" py-2 px-1 pt-4 flex-row">
                  <View className="flex-[4]">
                    <View className="flex flex-row mb-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "÷", false);

                          setOperator("÷");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          ÷
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "7" : prev + "7"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          7
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "8" : prev + "8"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          8
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "9" : prev + "9"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          9
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row my-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "×", false);

                          setOperator("×");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          ×
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "4" : prev + "4"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          4
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "5" : prev + "5"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          5
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "6" : prev + "6"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          6
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row my-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "-", false);

                          setOperator("-");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          -
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "1" : prev + "1"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          1
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "2" : prev + "2"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          2
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "3" : prev + "3"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          3
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row mt-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "+", false);

                          setOperator("+");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          +
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) =>
                            prev === "0" ? "0" : prev + "0"
                          )
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: ((windowWidth - 48) / 5) * 2 + 8,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          0
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center"
                        onPress={() =>
                          setSecondValue((prev) => {
                            if (
                              prev
                                .split(" ")
                                [prev.split(" ").length - 1].includes(".")
                            )
                              return prev;

                            return prev + ".";
                          })
                        }
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          .
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-[1]">
                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center mb-1 mx-1"
                      onPress={() => {
                        setSecondValue((prev) => prev.slice(0, -1));

                        if (secondValue === "") {
                          setSecondValue(firstValue);
                          setFirstValue("");
                          setOperator("");
                        }
                      }}
                      style={{ height: (windowWidth - 48) / 5 }}
                    >
                      <Ionicons
                        name="backspace-outline"
                        size={20}
                        color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center my-1 mx-1"
                      style={{ height: (windowWidth - 48) / 5 }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white dark:bg-[#383838] rounded-lg justify-center items-center mt-1 mx-1"
                      onPress={() => {
                        if (operator !== "") makeOperation(operator, true);

                        if (operator !== "" && secondValue === "") {
                          setOperator("");
                          setFirstValue("");
                          setSecondValue(firstValue);
                        }

                        if (
                          operator === "" &&
                          secondValue !== "" &&
                          secondValue !== "0"
                        ) {
                          if (
                            "currentBalance" in to &&
                            !("currentBalance" in from)
                          ) {
                            addIncome(from, to);
                          }

                          if (
                            "currentBalance" in from &&
                            !("currentBalance" in to)
                          ) {
                            addExpense(from, to);
                          }

                          if (
                            "currentBalance" in to &&
                            "currentBalance" in from
                          ) {
                            addTransfer(from, to);
                          }
                        }
                      }}
                      style={{ height: ((windowWidth - 48) / 5) * 2 + 8 }}
                    >
                      {operator === "" ? (
                        <Feather
                          name="check"
                          size={20}
                          color={colorScheme === "dark" ? "#E0E2EE" : "#1B1D1C"}
                        />
                      ) : (
                        <Text className="font-[Rounded-Medium] text-2xl text-main dark:text-[#E0E2EE]">
                          =
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="font-[Rounded-Medium] text-main dark:text-[#E0E2EE] text-center mb-2">
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default NewTransaction;
