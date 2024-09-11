import ITransaction from "@/interfaces/transaction";
import { numberWithSign } from "@/utils/format";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { styles } from "@/styles/shadow";
import { useTransactions } from "@/hooks";
const Transaction = ({ transaction }: { transaction: ITransaction }) => {
  const {
    categoryName,
    categoryColor,
    categoryIcon,
    accountName,
    amount,
    type,
    createdAt,
    comment,
    id,
  } = transaction;

  const { deleteTransaction } = useTransactions();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="bg-white py-3 px-2 mb-3 mx-3 rounded-2xl"
      style={styles.shadow}
      onLongPress={() => deleteTransaction(transaction)}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <View
            className={`justify-center items-center p-3.5 mr-1.5 rounded-full`}
            style={{ backgroundColor: "#" + categoryColor + "1A" }}
          >
            <Ionicons
              name={categoryIcon}
              color={"#" + categoryColor}
              size={16}
            />
          </View>

          <View>
            <Text className="font-[Rounded-Medium] text-lg text-main">
              {categoryName}
            </Text>

            <Text className="font-[Rounded-Regular] text-sm text-main-500">
              {accountName}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className="font-[Rounded-Medium] text-base"
            style={{ color: type === "Income" ? "#6ce590" : "#FF8092" }}
          >
            {numberWithSign(amount, type)}
          </Text>

          <Text className="font-[Rounded-Regular] text-sm text-main-500">
            {moment(createdAt * 1000).format("DD MMM YY")}
          </Text>
        </View>
      </View>

      {comment && (
        <Text className="font-[Rounded-Regular] text-sm text-main pt-2">
          {comment}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Transaction;
