import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";

import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { LineChart } from "@/components/Charts/LineChart";

import { Circle, Svg } from "react-native-svg";

import { useHomeAnalyticsChart } from "@/features/analytics-charts/hooks/useHomeAnalyticsChart";
import moment from "moment";
import { useTypedSelector } from "@/store";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { TransactionSummaryButton } from "../transactions/components/TransactionSummaryButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";

interface HomeAnalyticsChartProps {
  refreshing?: boolean;
}

const screenWidth = Dimensions.get("window").width;

export const HomeAnalyticsChart = ({ refreshing }: HomeAnalyticsChartProps) => {
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const { transactions } = useTypedSelector((state) => state.transactions);
  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const [incomes, setIncomes] = useState([0, 0]);
  const [expenses, setExpenses] = useState([0, 0]);

  const [noData, setNoData] = useState(true);

  const { transactionsSummary, getTransactionsSummaryByHour, loading, error } =
    useHomeAnalyticsChart();

  const chartContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loading || noData ? 0 : 1, {
        duration: 150,
      }),
    };
  }, [loading, noData]);

  const noDataStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(noData && !loading ? 1 : 0, {
        duration: 150,
      }),
    }),
    [loading, noData]
  );

  useEffect(() => {
    getTransactionsSummaryByHour();
  }, [getTransactionsSummaryByHour, dateRange]);

  useEffect(() => {
    if (refreshing) {
      getTransactionsSummaryByHour();
    }
  }, [getTransactionsSummaryByHour, refreshing]);

  useEffect(() => {
    if (transactionsSummary.length === 0) {
      setNoData(true);

      setIncomes([0, 0]);
      setExpenses([0, 0]);

      return;
    }

    setIncomes(transactionsSummary.map((item) => item.income));
    setExpenses(transactionsSummary.map((item) => item.expense));

    setNoData(false);
  }, [transactionsSummary]);

  useEffect(() => {
    getTransactionsSummaryByHour();
  }, [getTransactionsSummaryByHour, transactions]);

  const marginHorizontal = 24;

  return (
    <>
      <View className="bg-card-background rounded-2xl">
        <View className="m-3 flex-row justify-between items-center">
          <CustomText className="text-text-primary text-base font-[Rounded-Bold]">
            Analytics
          </CustomText>

          <Legend
            items={[
              {
                color: colors["--color-income"],
                label: "Incomes",
              },
              {
                color: colors["--color-expense"],
                label: "Expenses",
              },
            ]}
          />
        </View>

        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={chartContainerStyle}
        >
          <LineChart
            area={colorScheme === "light"}
            width={screenWidth - marginHorizontal}
            height={160}
            data={incomes}
            data2={expenses}
            strokeColors={[colors["--color-income"], colors["--color-expense"]]}
            strokeWidth={2.5}
            dotFill={colors["--color-card-background"]}
            labelsColor={colors["--color-text-secondary"]}
            yAxisLabelsPrefix="L "
            xAxisLabels={transactionsSummary.map(({ datetime }) =>
              moment(datetime).format("hh:mm A")
            )}
          />
        </Animated.ScrollView>

        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { top: 30, pointerEvents: "none" },
            noDataStyle,
          ]}
        >
          <View className="flex-1 justify-center items-center">
            <CustomText className="text-text-secondary text-s font-[Rounded-Regular]">
              No data available
            </CustomText>
          </View>
        </Animated.View>

        <LoadingIndicator visible={loading} style={{ top: 30 }} size={24} />
      </View>

      <View className="flex-row mt-3">
        <TransactionSummaryButton
          type="income"
          loading={loading}
          value={transactionsSummary.reduce(
            (acc, curr) => acc + curr.income,
            0
          )}
          active
        />

        <View className="w-3" />

        <TransactionSummaryButton
          type="expense"
          loading={loading}
          value={transactionsSummary.reduce(
            (acc, curr) => acc + curr.expense,
            0
          )}
          active
        />
      </View>
    </>
  );
};

interface LegendProps {
  items: LegendItemProps[];
}

const Legend = ({ items }: LegendProps) => {
  return (
    <View className="flex-row items-center justify-center -mr-2">
      {items.map(({ color, label }, index) => (
        <LegendItem
          key={"LegendItem:" + index + label}
          label={label}
          color={color}
        />
      ))}
    </View>
  );
};

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem = ({ color, label }: LegendItemProps) => {
  return (
    <View className="flex-row items-center justify-center mr-2">
      <View
        className="mr-1 rounded-full bg-card-background"
        style={{
          width: 9,
          height: 9,
          borderWidth: 2,
          borderColor: color,
        }}
      ></View>

      <CustomText className="text-text-secondary text-s font-[Rounded-Regular]">
        {label}
      </CustomText>
    </View>
  );
};
