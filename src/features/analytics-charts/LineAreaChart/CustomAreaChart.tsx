import React, { ReactElement, useCallback, useEffect } from "react";
import { useColorScheme } from "nativewind";

import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";

import {
  LineChart,
  LineChartPropsType,
  lineDataItem,
} from "react-native-gifted-charts";

import { CustomText } from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CustomAreaChartProps extends LineChartPropsType {
  title: string;
  legendItems: LegendItemProps[];
  loading?: boolean;
  noData?: boolean;
  pointerLabelComponent?: (
    items: lineDataItem[],
    index: number
  ) => ReactElement;
}

const screenWidth = Dimensions.get("window").width;

const CustomAreaChart = ({
  title,
  legendItems,
  loading = false,
  pointerConfig,
  noData = true,
  data = [],
  pointerLabelComponent,
  ...props
}: CustomAreaChartProps) => {
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();

  const calculateSpacing = useCallback(
    (data: lineDataItem[]) => {
      if (data.length === 0) return 0;

      if ((screenWidth - 88) / (data.length - 1) < 48) return 48;

      return (screenWidth - 88) / (data.length - 1);
    },
    [screenWidth]
  );

  const spacing = calculateSpacing(data);

  const calculateLabelPosition = useCallback(
    (data: lineDataItem[], spacing: number, idx: number) => {
      if (idx === 0) {
        return 5;
      }

      if (idx === data.length - 1) {
        if (spacing > 48) {
          return 5;
        } else {
          return -48;
        }
      }

      if (idx === data.length - 2) {
        if (spacing < 96) {
          return -48;
        } else {
          return 48;
        }
      }

      return 48;
    },
    [spacing]
  );

  const chartContainerOpacity = useSharedValue(0);

  const chartContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: chartContainerOpacity.value,
    };
  });

  const loadingStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loading ? 1 : 0, {
        duration: 300,
      }),
      pointerEvents: "none",
    };
  });

  const noDataStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(noData && !loading ? 1 : 0, {
        duration: 300,
      }),
      pointerEvents: "none",
    };
  });

  useEffect(() => {
    if (loading) {
      chartContainerOpacity.value = withTiming(0, {
        duration: 300,
      });
    } else {
      if (noData) return;

      chartContainerOpacity.value = withTiming(1, {
        duration: 300,
      });
    }
  }, [loading]);

  return (
    <View className="bg-card-background rounded-2xl" style={{ height: 220 }}>
      <View className="m-3 flex-row justify-between items-center">
        <CustomText className="text-text-primary text-base font-[Rounded-Bold]">
          {title}
        </CustomText>

        <Legend items={legendItems} />
      </View>

      <Animated.View style={[chartContainerStyle]}>
        <LineChart
          data={data}
          areaChart={colorScheme === "light"}
          height={150}
          startOpacity={0.3}
          endOpacity={0}
          spacing={spacing}
          initialSpacing={7}
          endSpacing={-(spacing - 12)}
          hideRules
          hideDataPoints
          curved
          thickness={2.5}
          curveType={1}
          stepHeight={150 / 3}
          noOfSections={3}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisLabelWidth={45}
          yAxisTextStyle={{
            fontSize: 12,
            color: colors["--color-text-secondary"],
            fontFamily: "Rounded-Regular",
          }}
          yAxisTextNumberOfLines={2}
          pointerConfig={{
            autoAdjustPointerLabelPosition: true,
            activatePointersOnLongPress: true,
            activatePointersDelay: 200,
            showPointerStrip: false,
            stripOverPointer: true,
            pointerLabelWidth: 80,
            pointerLabelHeight: 45,
            pointerVanishDelay: 500,
            radius: 5,
            pointerLabelComponent: pointerLabelComponent
              ? (items: any, secondaryDataItem: any, idx: number) => (
                  <View
                    style={[
                      {
                        width: 80,
                        height: 40,
                        backgroundColor: colors["--color-chip-background"],
                        borderRadius: 8,
                        top: 0,
                        left: calculateLabelPosition(data, spacing, idx),
                      },
                    ]}
                  >
                    {pointerLabelComponent(items, idx)}
                  </View>
                )
              : undefined,
            ...pointerConfig,
          }}
          isAnimated
          {...props}
        />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFillObject, { top: 30 }, loadingStyle]}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors["--color-accent"]} />
        </View>
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFillObject, { top: 30 }, noDataStyle]}
      >
        <View className="flex-1 justify-center items-center">
          <CustomText className="text-text-secondary text-base font-[Rounded-Regular]">
            No data available
          </CustomText>
        </View>
      </Animated.View>
    </View>
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
        className="w-1.5 h-1.5 mr-1 rounded-full"
        style={{
          backgroundColor: color,
        }}
      ></View>

      <CustomText className="text-text-secondary text-xs font-[Rounded-Regular]">
        {label}
      </CustomText>
    </View>
  );
};

export default CustomAreaChart;
