import { TouchableOpacity, View } from "react-native";
import moment from "moment";

import { useColorScheme } from "nativewind";

import { Feather, Ionicons } from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";

import { icons } from "@/constants/icons";
import { colors } from "@/constants/colors";

import { useTypedSelector } from "@/store";

import useThemeColors from "@/hooks/useThemeColors";
import ITransaction from "@/interfaces/transaction";

import formatCurrency from "@/utils/formatCurrency";
import IAccount from "@/interfaces/account";
import ICategory from "@/interfaces/category";
import { styles } from "@/styles/shadow";

interface TransactionProps {
  transaction: ITransaction;
}

export const Transaction = ({ transaction }: TransactionProps) => {
  const themeColors = useThemeColors();
  const { colorScheme = "light" } = useColorScheme();

  const { categories } = useTypedSelector((state) => state.categories);
  const { accounts } = useTypedSelector((state) => state.accounts);

  const getIcon = (id?: number) =>
    icons.find((i) => i.id === id)?.name ?? "alert";

  const getColor = (id?: number) =>
    colors.find((c) => c.id === id)?.[colorScheme] ??
    themeColors["--color-error"];

  const getAccount = (id?: number) => accounts.find((a) => a.id === id);
  const getCategory = (id?: number) => categories.find((c) => c.id === id);

  let title: string = "Unknown";

  let subtitle: string = "Unknown";
  let subtitleColor: string = themeColors["--color-error"];

  let icon: keyof typeof Ionicons.glyphMap = "alert";
  let color: string = themeColors["--color-error"];

  if (transaction.type === "income" || transaction.type === "expense") {
    let account: IAccount | undefined;
    let category: ICategory | undefined;

    if (transaction.type === "income") {
      account = getAccount(transaction.destinationId);
      category = getCategory(transaction.originId);
    }

    if (transaction.type === "expense") {
      account = getAccount(transaction.originId);
      category = getCategory(transaction.destinationId);
    }

    title = category?.name ?? "Unknown";

    icon = getIcon(category?.icon);
    color = getColor(category?.color);

    subtitle = account?.name ?? "Unknown";
    subtitleColor = getColor(account?.color);
  }

  if (transaction.type === "transfer") {
    const origin = getAccount(transaction.originId);
    const destination = getAccount(transaction.destinationId);

    title = "Transfer";

    icon = "repeat";
    color = themeColors["--color-transfer"];

    subtitle = `${origin?.name ?? "Unknown"} → ${
      destination?.name ?? "Unknown"
    }`;
    subtitleColor = getColor(origin?.color);
  }

  return (
    <TouchableOpacity className="flex-row items-center py-4 border-b border-separator">
      <View
        className="p-2 flex items-center justify-center"
        style={{
          backgroundColor: color + "26",
          borderRadius: 12,
          width: 40,
          height: 40,
        }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <View className="mx-3 items-start flex-[1]">
        <CustomText className="font-[Rounded-Medium] text-base text-text-primary">
          {title}
        </CustomText>

        <View className="flex-row items-center">
          <View
            className="items-center px-1"
            style={{ backgroundColor: subtitleColor + "26", borderRadius: 5 }}
          >
            <CustomText
              className="font-[Rounded-Regular] text-xs"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </CustomText>
          </View>

          <View className="flex-row items-center ml-1 bg-separator px-1 rounded-[5]">
            <Feather
              className="mr-0.5"
              name="clock"
              size={10}
              color={themeColors["--color-text-secondary"]}
            />

            <CustomText className="font-[Rounded-Regular] text-xs text-text-secondary">
              {moment(transaction.date * 1000).format("hh:mm A")}
            </CustomText>
          </View>
        </View>
      </View>

      <CustomText
        className={`font-[Rounded-Medium] text-sm`}
        style={{
          color: themeColors[`--color-${transaction.type}`],
        }}
      >
        {transaction.type === "expense"
          ? "- "
          : transaction.type === "income"
          ? "+ "
          : ""}

        {formatCurrency(transaction.amount, {
          showSign: "never",
        })}
      </CustomText>
    </TouchableOpacity>
  );
};
