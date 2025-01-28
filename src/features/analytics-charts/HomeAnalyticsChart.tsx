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

import { LineChart } from "react-native-chart-kit";

import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Circle, Svg } from "react-native-svg";

import { useHomeAnalyticsChart } from "@/features/analytics-charts/hooks/useHomeAnalyticsChart";
import moment from "moment";
import { useTypedSelector } from "@/store";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { TransactionSummaryButton } from "../transactions/components/TransactionSummaryButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";

const screenWidth = Dimensions.get("window").width;

export const HomeAnalyticsChart = () => {
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
        duration: 300,
      }),
    };
  }, [loading, noData]);

  const loadingStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(loading ? 1 : 0, {
        duration: 300,
      }),
    }),
    [loading]
  );

  const noDataStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(noData && !loading ? 1 : 0, {
        duration: 300,
      }),
    }),
    [loading, noData]
  );

  useEffect(() => {
    getTransactionsSummaryByHour();
  }, [getTransactionsSummaryByHour, dateRange]);

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

  const chartData = {
    labels: transactionsSummary.map(({ datetime }) =>
      moment(datetime).format("hh:mm A")
    ),
    datasets: [
      {
        data: incomes,
        color: (opacity = 1) => colors["--color-income"],
      },
      {
        data: expenses,
        color: (opacity = 1) => colors["--color-expense"],
      },
    ],
  };

  const dataLength = chartData.datasets[0].data.length;

  const parentWidth = screenWidth;
  const contentContainerWidth = parentWidth + 60;

  let spacing = contentContainerWidth / dataLength;

  let chartWidth = dataLength * spacing;

  if (dataLength === 3) {
    spacing = (parentWidth - 74) / (dataLength - 1);
    chartWidth = dataLength * spacing;
  }

  if (dataLength === 2) {
    spacing = parentWidth - 90;
    chartWidth = dataLength * spacing;
  }

  if (spacing < 90) {
    spacing = 90;
    chartWidth = dataLength * spacing + 10;
  }

  return (
    <>
      <View className="bg-card-background rounded-2xl" style={{ height: 220 }}>
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
            data={chartData}
            bezier
            width={chartWidth}
            height={160}
            withInnerLines={false}
            withOuterLines={false}
            yAxisInterval={3}
            style={{
              marginRight: 0,
              marginLeft: 0,
            }}
            renderDotContent={({ x, y, index, indexData }) => {
              const isIncome = chartData.datasets[0].data[index] === indexData;

              const strokeColor = isIncome
                ? colors["--color-income"]
                : colors["--color-expense"];

              return (
                <Svg
                  key={
                    "chart-dot-" + index + indexData + Math.random() * 100000
                  }
                >
                  <Circle
                    cx={x}
                    cy={y}
                    r="4"
                    stroke={strokeColor}
                    strokeWidth="2"
                    fill={colors["--color-card-background"]}
                  />
                </Svg>
              );
            }}
            formatYLabel={(value) => {
              const floatValue = parseFloat(value);

              if (isNaN(floatValue)) return value;

              const roundedValue = Math.round(floatValue / 10) * 10;

              const suffix = roundedValue > 999 ? "K" : "";

              return `L ${
                suffix
                  ? (roundedValue / 1000) % 1 === 0
                    ? roundedValue / 1000
                    : (roundedValue / 1000).toFixed(1)
                  : roundedValue
              }${suffix}`;
            }}
            chartConfig={{
              backgroundColor: colors["--color-card-background"],
              backgroundGradientFrom: colors["--color-card-background"],
              backgroundGradientTo: colors["--color-card-background"],
              decimalPlaces: 0,
              color: (opacity = 1) =>
                colorScheme === "light"
                  ? `rgba(217, 112, 136, ${opacity})`
                  : colors["--color-card-background"],
              labelColor: (opacity = 1) => colors["--color-text-secondary"],
              strokeWidth: 2.5,
              propsForHorizontalLabels: {
                translateX: -20,
                textAnchor: "middle",
              },
              propsForVerticalLabels: {
                translateY: 0,
              },
              propsForLabels: {
                fontSize: 11,
                fontFamily: "Rounded-Regular",
                fill: colors["--color-text-secondary"],
              },
            }}
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

        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { top: 30, pointerEvents: "none" },
            loadingStyle,
          ]}
        >
          <LoadingIndicator />
        </Animated.View>
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
