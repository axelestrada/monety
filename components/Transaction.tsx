import ITransaction from "@/interfaces/transaction";
import { numberWithSign } from "@/utils/format";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { styles } from "@/styles/shadow";
import { useTransactions } from "@/hooks";
import { useColorScheme } from "nativewind";
import { darkColors } from "@/constants/colors";
const Transaction = ({ transaction }: { transaction: ITransaction }) => {
  const {
    categoryName,
    categoryColor,
    categoryIcon,
    destinationAccountName,
    destinationAccountColor,
    destinationAccountIcon,
    accountName,
    amount,
    type,
    createdAt,
    date,
    comment,
  } = transaction;

  const { deleteTransaction } = useTransactions();
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="bg-white dark:bg-[#1A1A1A] py-3 px-2 mb-3 mx-3 rounded-2xl"
      style={{
        elevation: 16,
        shadowColor: "#1b1d1c1f"
      }}
      onLongPress={() => deleteTransaction(transaction)}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <View
            className={`justify-center items-center p-3.5 mr-1.5 rounded-full`}
            style={{
              backgroundColor:
                "#" +
                (colorScheme === "dark"
                  ? darkColors[
                      categoryColor || destinationAccountColor || "623387"
                    ]
                  : categoryColor || destinationAccountColor) +
                "1A",
            }}
          >
            <Ionicons
              name={categoryIcon || destinationAccountIcon}
              color={
                "#" +
                (colorScheme === "dark"
                  ? darkColors[
                      categoryColor || destinationAccountColor || "623387"
                    ]
                  : categoryColor || destinationAccountColor)
              }
              size={16}
            />
          </View>

          <View>
            <Text className="font-[Rounded-Medium] text-lg text-main dark:text-[#F5F5F5]">
              {categoryName || destinationAccountName}
            </Text>

            <Text className="font-[Rounded-Regular] text-sm text-main-500 dark:text-[#F5F5F580]">
              {accountName}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className="font-[Rounded-Medium] text-base"
            style={{
              color:
                type === "Income"
                  ? colorScheme === "dark"
                    ? "#5bbe77"
                    : "#02AB5B"
                  : type === "Expense"
                  ? colorScheme === "dark"
                    ? "#FF8092"
                    : "#FF8092"
                  : colorScheme === "dark"
                  ? "#F5F5F5"
                  : "#1B1D1C",
            }}
          >
            {numberWithSign(amount, type)}
          </Text>

          <Text className="font-[Rounded-Regular] text-sm text-main-500 dark:text-[#F5F5F580]">
            {moment(date * 1000).format("hh:mm A")}
          </Text>
        </View>
      </View>

      {comment && (
        <Text className="font-[Rounded-Regular] text-sm text-main dark:text-[#F5F5F5] pt-1">
          {comment}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Transaction;
