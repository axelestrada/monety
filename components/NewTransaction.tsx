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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundGradient from "./ui/BackgroundGradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import Header from "./Header";
import { styles } from "@/styles/shadow";
import { useState } from "react";
import { IAccount } from "@/interfaces";
import { useCategories } from "@/hooks";
import { useAppDispatch, useTypedSelector } from "@/store";
import { useSQLiteContext } from "expo-sqlite";
import uuid from "react-native-uuid";
import { transactionServices } from "@/reducers/transactionsSlice";
import moment from "moment";
import { accountsServices } from "@/reducers/accountsSlice";

const NewTransaction = ({
  hideModal,
  categoryId,
}: {
  hideModal: () => void;
  categoryId: string;
}) => {
  const { timeRange } = useTypedSelector((state) => state.userPreferences);
  const { categories } = useTypedSelector((state) => state.categories);
  const { accounts } = useTypedSelector((state) => state.accounts);

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

  const category = categories.find((category) => category.id === categoryId);
  const account = accounts.find((account) => account.name === "Cash");

  const dispatch = useAppDispatch();

  const addTransaction = async () => {
    try {
      if (account && category) {
        const id = uuid.v4().toString();

        let createdAt = selectedDate;
        let date = moment().unix();

        if (selectedDate !== timeRange.from) {
          createdAt = selectedDate;
          date = selectedDate;
        }

        await db.runAsync(
          `INSERT INTO Transactions (id, category_id, account_id, created_at, date, amount, comment, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            id,
            category.id,
            account.id,
            createdAt,
            date,
            parseFloat(secondValue),
            comment,
            category.type,
          ]
        );

        await db.runAsync(
          `
          UPDATE Accounts SET currentBalance = ? WHERE id = ?
        `,
          category.type === "Income"
            ? account.currentBalance + parseFloat(secondValue)
            : account.currentBalance - parseFloat(secondValue),
          account.id
        );

        setFirstValue("");
        setSecondValue("");

        dispatch(
          transactionServices.actions.addTransaction({
            id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
            accountName: account.name,
            createdAt: createdAt,
            date,
            amount: parseFloat(secondValue),
            comment,
            type: category.type,
          })
        );

        if (category.type === "Income") {
          dispatch(
            accountsServices.actions.incrementBalance({
              id: account.id,
              amount: parseFloat(secondValue),
            })
          );
        } else if (category.type === "Expense") {
          dispatch(
            accountsServices.actions.decrementBalance({
              id: account.id,
              amount: parseFloat(secondValue),
            })
          );
        }

        hideModal();
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
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

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TouchableOpacity
        className="flex-[1] pt-24 justify-end bg-[#00000080]"
        activeOpacity={1}
        onPress={hideModal}
      >
        <TouchableWithoutFeedback>
          <View className="rounded-t-3xl overflow-hidden bg-white">
            <BackgroundGradient />

            <ScrollView>
              <View className="flex-row mx-1 mt-4">
                {account && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="bg-white rounded-2xl p-2 mx-1 flex-1"
                    style={{ ...styles.shadow }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`justify-center items-center p-3 mr-2 rounded-full`}
                        style={{ backgroundColor: "#" + account.color + "1A" }}
                      >
                        <Ionicons
                          name={account.icon}
                          color={"#" + account.color}
                          size={18}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          className="text-main font-[Rounded-Medium] text-lg"
                        >
                          {account.name}
                        </Text>
                      </View>

                      <Ionicons name="chevron-down" color="#1b1d1c" size={14} />
                    </View>
                  </TouchableOpacity>
                )}

                {category && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="bg-white rounded-2xl p-2 mx-2 flex-1"
                    style={{ ...styles.shadow }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`justify-center items-center p-3 mr-2 rounded-full`}
                        style={{ backgroundColor: "#" + category.color + "1A" }}
                      >
                        <Ionicons
                          name={category.icon}
                          color={"#" + category.color}
                          size={18}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          className="text-main font-[Rounded-Medium] text-lg"
                        >
                          {category.name}
                        </Text>
                      </View>

                      <Ionicons name="chevron-down" color="#1b1d1c" size={14} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View className="py-8 justify-center items-center">
                <Text className="text-main font-[Rounded-Bold] text-4.5xl">
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

              <View className="bg-[#ffffff4d] rounded-3xl">
                <TextInput
                  className="text-center mt-4 font-[Rounded-Medium] text-base text-main"
                  placeholder="Add comment..."
                  value={comment}
                  onChangeText={(value) => setComment(value)}
                />

                <View className=" py-2 px-1 pt-4 flex-row">
                  <View className="flex-[4]">
                    <View className="flex flex-row mb-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "÷", false);

                          setOperator("÷");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          ÷
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          7
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          8
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          9
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row my-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "×", false);

                          setOperator("×");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          ×
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          4
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          5
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          6
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row my-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "-", false);

                          setOperator("-");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          -
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          1
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          2
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          3
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex flex-row mt-1 justify-between mx-1">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
                        onPress={() => {
                          makeOperation(operator || "+", false);

                          setOperator("+");
                        }}
                        style={{
                          height: (windowWidth - 48) / 5,
                          width: (windowWidth - 48) / 5,
                        }}
                      >
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          +
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          0
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="bg-white rounded-lg justify-center items-center"
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
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          .
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-[1]">
                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white rounded-lg justify-center items-center mb-1 mx-1"
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
                        color={"#1b1d1c"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white rounded-lg justify-center items-center my-1 mx-1"
                      style={{ height: (windowWidth - 48) / 5 }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={"#1b1d1c"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="bg-white rounded-lg justify-center items-center mt-1 mx-1"
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
                          addTransaction();
                        }
                      }}
                      style={{ height: ((windowWidth - 48) / 5) * 2 + 8 }}
                    >
                      {operator === "" ? (
                        <Feather name="check" size={20} color={"#1b1d1c"} />
                      ) : (
                        <Text className="font-[Rounded-Medium] text-2xl text-main">
                          =
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="font-[Rounded-Medium] text-main text-center mb-2">
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
