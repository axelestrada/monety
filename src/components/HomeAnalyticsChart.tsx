import moment from "moment";

import CustomAreaChart from "@/features/analytics-charts/LineAreaChart/CustomAreaChart";

import PointerLabelComponent from "@/features/analytics-charts/LineAreaChart/PointerLabelComponent";
import { calculateMaxValue } from "@/features/analytics-charts/LineAreaChart/utils/calculateMaxValue";
import { getYAxisLabelTexts } from "@/features/analytics-charts/LineAreaChart/utils/getYAxisLabelTexts";

import useThemeColors from "@/hooks/useThemeColors";
import useHomeAnalyticsChart from "@/features/analytics-charts/hooks/useHomeAnalyticsChart";
import { useTypedSelector } from "@/store";
import { useEffect, useState } from "react";

import { lineDataItem } from "react-native-gifted-charts";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { CustomText } from "./CustomText";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const HomeAnalyticsChart = () => {
  const colors = useThemeColors();

  const { transactionsSummary, getTransactionsSummaryByHour, loading, error } =
    useHomeAnalyticsChart();
  const { dateRange } = useTypedSelector((state) => state.userPreferences);
  const [chartData, setChartData] = useState<{
    incomes: lineDataItem[];
    expenses: lineDataItem[];
  }>({
    incomes: [],
    expenses: [],
  });

  const [noData, setNoData] = useState(true);

  const [maxValue, setMaxValue] = useState(0);
  const [yAxisLabelTexts, setYAxisLabelTexts] = useState<string[]>([]);

  const legendItems = [
    { color: colors["--color-income"], label: "Incomes" },
    { color: colors["--color-expense"], label: "Expenses" },
  ];

  useEffect(() => {
    if (transactionsSummary.length === 0) {
      setNoData(true);
      setChartData({
        incomes: [],
        expenses: [],
      });
      return;
    }

    const incomes = transactionsSummary.map((item) => ({
      value: item.income,
      date: item.datetime,
    }));

    const expenses = transactionsSummary.map((item) => ({
      value: item.expense,
      date: item.datetime,
    }));

    const max = Math.max(
      ...[...incomes, ...expenses].map((item) => item.value)
    );

    const maxValue = calculateMaxValue(0, max);
    const yAxisLabelTexts = getYAxisLabelTexts(0, max, 3);

    setYAxisLabelTexts(yAxisLabelTexts);
    setMaxValue(maxValue);

    setChartData({
      incomes,
      expenses,
    });

    setNoData(false);
  }, [transactionsSummary]);

  useEffect(() => {
    getTransactionsSummaryByHour();
  }, [getTransactionsSummaryByHour, dateRange]);


  return (
    <CustomAreaChart
      title="Statistics"
      loading={loading}
      noData={noData}
      legendItems={legendItems}
      data={chartData.incomes}
      data2={chartData.expenses}
      color1={colors["--color-income"]}
      color2={colors["--color-expense"]}
      startFillColor1={colors["--color-income"]}
      startFillColor2={colors["--color-expense"]}
      yAxisLabelTexts={yAxisLabelTexts}
      maxValue={maxValue}
      pointerConfig={{
        pointer1Color: colors["--color-income"],
        pointer2Color: colors["--color-expense"],
      }}
      pointerLabelComponent={(items, index) => (
        <PointerLabelComponent
          title={moment(transactionsSummary[index].datetime).format("hh:mm A")}
          items={items.map((item, index) => ({
            value: (index === 0 ? "+" : "-") + "L" + item.value,
            color:
              index === 0
                ? colors["--color-income"]
                : colors["--color-expense"],
          }))}
        />
      )}
    />
  );
};
