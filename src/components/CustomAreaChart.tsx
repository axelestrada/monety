import React, { ReactElement, useCallback } from "react";

import { Dimensions, View } from "react-native";
import { useColorScheme } from "nativewind";
import {
  LineChart,
  LineChartPropsType,
  lineDataItem,
} from "react-native-gifted-charts";

import CustomText from "@/components/CustomText";
import useThemeColors from "@/hooks/useThemeColors";

interface CustomAreaChartProps extends LineChartPropsType {
  title: string;
  legendItems: LegendItemProps[];
  pointerLabelComponent?: (
    items: lineDataItem[],
    index: number
  ) => ReactElement;
}

const screenWidth = Dimensions.get("window").width;

const CustomAreaChart = ({
  title,
  legendItems,
  pointerConfig,
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
    [data]
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
    [data, spacing]
  );

  console.log("spacing", spacing);

  return (
    <View className="bg-card-background rounded-2xl shadow-md shadow-shadow-30">
      <View className="m-3 flex-row justify-between items-center">
        <CustomText className="text-text-primary text-base font-[Rounded-Bold]">
          {title}
        </CustomText>

        <Legend items={legendItems} />
      </View>

      <LineChart
        data={data}
        areaChart={colorScheme === "light"}
        height={150}
        startOpacity={0.4}
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
          color: colors["--color-text-primary-75"],
          fontFamily: "Rounded-Regular",
        }}
        yAxisTextNumberOfLines={2}
        pointerConfig={{
          autoAdjustPointerLabelPosition: true,
          activatePointersOnLongPress: true,
          activatePointersDelay: 200,
          showPointerStrip: false,
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
                      elevation: colorScheme === "light" ? 8 : 0,
                      shadowColor: "#1B1D1C80",
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
    </View>
  );
};

interface LegendProps {
  items: LegendItemProps[];
}

const Legend = ({ items }: LegendProps) => {
  return (
    <View className="flex-row items-center justify-center -mr-1">
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
        className="w-2 h-2 mr-1 rounded-full"
        style={{
          backgroundColor: color,
        }}
      ></View>

      <CustomText className="text-text-primary text-sm font-[Rounded-Medium]">
        {label}
      </CustomText>
    </View>
  );
};

export default CustomAreaChart;
