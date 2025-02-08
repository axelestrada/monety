import {
  Alert,
  StyleProp,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from "react-native";
import moment, { duration } from "moment";

import { useColorScheme } from "nativewind";

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";

import { CustomText } from "@/components/CustomText";

import { icons } from "@/constants/icons";
import { colors } from "@/constants/colors";

import { useAppDispatch, useTypedSelector } from "@/store";

import useThemeColors from "@/hooks/useThemeColors";
import ITransaction from "@/features/transactions/types/transaction";

import formatCurrency from "@/components/Header/utils/formatCurrency";
import IAccount from "@/features/accounts/types/account";
import ICategory from "@/features/categories/types/category";
import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { normalizeAccount } from "@/features/accounts/normalizers/normalizeAccount";
import { accountsServices } from "@/features/accounts/redux/reducers/accountsSlice";
import Animated, {
  AnimatedStyle,
  BounceIn,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  ZoomInUp,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  NativeGesture,
} from "react-native-gesture-handler";

interface TransactionProps {
  transaction: ITransaction;
  index?: number;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  externalScrollGesture: NativeGesture;
}

const BUTTON_WIDTH = 70;
const SWIPE_THRESHOLD = 55;

export const Transaction = ({
  transaction,
  index = 0,
  style,
  externalScrollGesture,
}: TransactionProps) => {
  const themeColors = useThemeColors();
  const { colorScheme = "light" } = useColorScheme();

  const db = useSQLiteContext();

  const dispatch = useAppDispatch();

  const { categories } = useTypedSelector((state) => state.categories);
  const { accounts } = useTypedSelector((state) => state.accounts);

  const getIcon = (id?: number) =>
    icons.find((i) => i.id === id)?.name || "alert";

  const getColor = (id?: number) =>
    colors.find((c) => c.id === id)?.[colorScheme] ||
    themeColors["--color-error"];

  const getAccount = (id: number) => accounts.find((a) => a.id === id);
  const getCategory = (id: number) => categories.find((c) => c.id === id);

  let title: string = "";

  let subtitle: string = "";
  let subtitleColor: string = "";

  let icon: keyof typeof Ionicons.glyphMap = "alert";
  let color: string = "";

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

    title = category?.name || "Unknown";

    icon = getIcon(category?.icon);
    color = getColor(category?.color);

    subtitle = account?.name || "Unknown";
    subtitleColor = getColor(account?.color);
  }

  if (transaction.type === "transfer") {
    const origin = getAccount(transaction.originId);
    const destination = getAccount(transaction.destinationId);

    title = "Transfer";

    icon = "repeat";
    color = themeColors["--color-transfer"];

    subtitle = `${origin?.name || "Unknown"} → ${
      destination?.name || "Unknown"
    }`;
    subtitleColor = getColor(origin?.color);
  }

  const onDelete = useCallback(() => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "No, Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Delete",
          onPress: async () => {
            await db.runAsync("DELETE FROM Transactions WHERE id = ?", [
              transaction.id,
            ]);

            if (transaction.type === "income") {
              await db.runAsync(
                "UPDATE Accounts SET current_balance = current_balance - ? WHERE id = ?",
                [transaction.amount, transaction.destinationId]
              );
            } else {
              await db.runAsync(
                "UPDATE Accounts SET current_balance = current_balance + ? WHERE id = ?",
                [transaction.amount, transaction.originId]
              );
            }

            const accounts = await db.getAllAsync<any>(
              "SELECT * FROM Accounts;"
            );
            dispatch(
              accountsServices.actions.setAccounts(
                accounts.map((account) => normalizeAccount(account))
              )
            );
          },
        },
      ]
    );
  }, [transaction]);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const [showActions, setShowActions] = useState(false);

  const translateX = useSharedValue(0);

  const executeAction = (action: () => void) => {
    Vibration.vibrate(50);
    action();
  };

  const onEdit = () => {
    console.log("Edit");
  };

  const transactionPanGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.min(
        Math.max(event.translationX, -BUTTON_WIDTH),
        BUTTON_WIDTH
      );
    })
    .onEnd(() => {
      if (translateX.value <= -SWIPE_THRESHOLD) {
        runOnJS(executeAction)(onDelete);
      } else if (translateX.value >= SWIPE_THRESHOLD) {
        runOnJS(executeAction)(onEdit);
      }
      translateX.value = withTiming(0, { duration: 150 });
    })
    .simultaneousWithExternalGesture(externalScrollGesture);

  const transactionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: scale.value,
        },
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  useEffect(() => {
    return () => {
      setShowActions(false);
    };
  }, []);

  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }, () => {
        runOnJS(setShowActions)(true);
      })
    );

    scale.value = withDelay(
      index * 100,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
    );
  }, [opacity, scale, index]);

  const transactionStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <View className="relative">
      {showActions && (
        <View
          className="absolute h-full left-0 justify-center items-center"
          style={{
            width: BUTTON_WIDTH,
            backgroundColor: color,
          }}
        >
          <Octicons
            name="pencil"
            color={themeColors["--color-text-white"]}
            size={22}
          />
        </View>
      )}

      <GestureDetector gesture={transactionPanGesture}>
        <Animated.View
          style={[transactionAnimatedStyle, style]}
          className="z-10 bg-main-background py-4 border-b border-separator px-3"
        >
          <View className="flex-row items-center">
            <View
              className="flex items-center justify-center"
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
                  style={{
                    backgroundColor: subtitleColor + "26",
                    borderRadius: 5,
                  }}
                >
                  <CustomText
                    className="font-[Rounded-Regular] text-xs"
                    style={{ color: subtitleColor }}
                  >
                    {subtitle}
                  </CustomText>
                </View>

                <View className="flex-row items-center ml-1 bg-separator px-1 rounded-[5]">
                  {transaction.comment && (
                    <MaterialCommunityIcons
                      className="mr-1"
                      name="comment-processing-outline"
                      size={11}
                      color={themeColors["--color-text-secondary"]}
                    />
                  )}

                  <Feather
                    className="mr-1"
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
          </View>
        </Animated.View>
      </GestureDetector>

      {showActions && (
        <View
          className="absolute h-full right-0 justify-center items-center"
          style={{
            width: BUTTON_WIDTH,
            backgroundColor: color,
          }}
        >
          <Octicons
            name="trash"
            color={themeColors["--color-text-white"]}
            size={22}
          />
        </View>
      )}
    </View>
  );
};
