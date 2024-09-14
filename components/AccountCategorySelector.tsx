import { IAccount, ICategory } from "@/interfaces";
import { useTypedSelector } from "@/store";
import { styles } from "@/styles/shadow";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function AccountCategorySelector({
  type,
  setTransactionDetails,
  elementType,
  hideModal,
}: {
  type: "Accounts" | "Categories";
  setTransactionDetails: (transaction: {
    from?: ICategory | IAccount;
    to?: ICategory | IAccount;
  }) => void;
  hideModal: () => void;
  elementType: "from" | "to";
}) {
  const { categories } = useTypedSelector((state) => state.categories);
  const { accounts } = useTypedSelector((state) => state.accounts);

  return (
    <ScrollView className="p-3 h-[400]">
      <View className="mb-3">
        <Text className="text-center mb-4 mt-2 text-xl font-[Rounded-Bold]">
          Select {type === "Accounts" ? "Account" : "Category"}
        </Text>

        {type === "Categories"
          ? categories.map(
              (category) =>
                category.id && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="bg-white rounded-2xl p-2 mb-3 mx-1 flex-1"
                    onPress={() => {
                      if (elementType === "from") {
                        setTransactionDetails({ from: category });
                      } else {
                        setTransactionDetails({ to: category });
                      }

                      hideModal();
                    }}
                    key={category.id}
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
                    </View>
                  </TouchableOpacity>
                )
            )
          : accounts.map(
              (account) =>
                account.id && (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="bg-white rounded-2xl p-2 mb-3 mx-1 flex-1"
                    key={account.id + "AccountCategorySelector"}
                    onPress={() => {
                      if (elementType === "from") {
                        setTransactionDetails({ from: account });
                      } else {
                        setTransactionDetails({ to: account });
                      }

                      hideModal();
                    }}
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

                      <View style={{flex: 1}}>
                        <Text className="font-[Rounded-Medium] text-lg text-main">
                          {account.name}
                        </Text>

                        <Text
                          className={`font-[Rounded-Regular] text-base ${
                            account.currentBalance < 0
                              ? "text-red"
                              : "text-main-500"
                          }`}
                        >
                          L{" "}
                          {Intl.NumberFormat("en-US")
                            .format(account.currentBalance)
                            .replace("-", "")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
            )}
      </View>
    </ScrollView>
  );
}

export default AccountCategorySelector;
