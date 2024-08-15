import { TransactionInterface } from "@/interfaces/transaction";
import { numberWithSign } from "@/utils/format";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import styles from "@/styles/shadow";
const Transaction = ({
  transaction,
}: {
  transaction: TransactionInterface;
}) => {
  const { category, account, amount, type, createdAt } = transaction;

  return (
    <TouchableOpacity activeOpacity={0.5} className="bg-white p-4 mb-4 mx-4 rounded-2xl flex flex-row justify-between items-center" style={styles.shadow}>
      <View className="flex flex-row items-center">
        <View
          className={`justify-center items-center p-4 mr-2 rounded-full`}
          style={{ backgroundColor: category.color + "1A" }}
        >
          <FontAwesome5 name={category.icon} color={category.color} size={18} />
        </View>

        <View>
          <Text className="font-[Rounded-Bold] text-lg text-main">
            {category.name}
          </Text>

          <Text className="font-[Rounded-Regular] text-sm text-main-500">
            {account.name}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="font-[Rounded-Bold] text-lg text-main">
          {numberWithSign(amount, type)}
        </Text>

        <Text
          style={{
            fontFamily: "Rounded-Regular",
            fontSize: 14,
            color: "#939496",
          }}
        >
          {moment(createdAt).format("DD MMM YY")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Transaction;
