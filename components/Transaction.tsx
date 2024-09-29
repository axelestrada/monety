import ITransaction from "@/interfaces/transaction";
import { numberWithSign } from "@/utils/format";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { styles } from "@/styles/shadow";
import { useTransactions } from "@/hooks";
import { useColorScheme } from "nativewind";
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
      className="bg-white dark:bg-[#131416] py-3 px-2 mb-3 mx-3 rounded-2xl"
      style={styles.shadow}
      onLongPress={() => deleteTransaction(transaction)}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <View
            className={`justify-center items-center p-3.5 mr-1.5 rounded-full`}
            style={{
              backgroundColor:
                "#" + (categoryColor || destinationAccountColor) + "1A",
            }}
          >
            <Ionicons
              name={categoryIcon || destinationAccountIcon}
              color={"#" + (categoryColor || destinationAccountColor)}
              size={16}
            />
          </View>

          <View>
            <Text className="font-[Rounded-Medium] text-lg text-main dark:text-white">
              {categoryName || destinationAccountName}
            </Text>

            <Text className="font-[Rounded-Regular] text-sm text-main-500 dark:text-[#FFFFFF80]">
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
                    ? "#4EC871"
                    : "#02AB5B"
                  : type === "Expense"
                  ? colorScheme === "dark"
                    ? "#E95A5C"
                    : "#FF8092"
                  : "#1B1D1C",
            }}
          >
            {numberWithSign(amount, type)}
          </Text>

          <Text className="font-[Rounded-Regular] text-sm text-main-500 dark:text-[#FFFFFF80]">
            {moment(date * 1000).format("hh:mm A")}
          </Text>
        </View>
      </View>

      {comment && (
        <Text className="font-[Rounded-Regular] text-sm text-main dark:text-white pt-1">
          {comment}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Transaction;
