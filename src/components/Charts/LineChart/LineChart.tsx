import { Dimensions, StyleProp, Text, TextStyle, View } from "react-native";

//D3
import * as d3 from "d3-shape";
import { scaleLinear } from "d3-scale";
import {
  Circle,
  ForeignObject,
  Line,
  Path,
  Svg,
  Text as SvgText,
} from "react-native-svg";
import React from "react";
import { CustomText } from "@/components/CustomText";

const screenWidth = Dimensions.get("window").width;

type LineChartProps = {
  width?: number;
  height?: number;
  data: number[];
  data2?: number[];
  strokeColors?: string[];
  strokeWidth?: number;
  margin?: number;
  dotFill?: string;
  labelsColor?: string;
  yAxisLabelsPrefix?: string;
  xAxisLabels?: string[];
};

export const LineChart = ({
  width: chartWidth = screenWidth,
  height = 180,
  data = [],
  data2 = [],
  strokeColors = [],
  strokeWidth = 3,
  margin = 20,
  dotFill = "#FFFFFF",
  labelsColor,
  yAxisLabelsPrefix = "",
  xAxisLabels = [],
}: LineChartProps) => {
  let width = chartWidth;

  const spacing = (screenWidth - 24 - 64 - 40) / (data.length - 1);

  if (spacing < 65) {
    width = 64 + data.length * 65;
  }

  const max = Math.max(...[...data, ...data2]);

  const yAxisContainerWidth = 64;

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([yAxisContainerWidth, width - margin - 5]);

  const yScale = scaleLinear()
    .domain([0, max])
    .range([height - margin, margin]);

  const lineGenerator = d3
    .line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveBumpX);

  const yAxisLabels = [0, max / 3, (max / 3) * 2, max].map((item) =>
    Math.floor(item)
  );

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Svg width={width + margin - 5} height={height + margin}>
        {yAxisLabels.map((tick, i) => (
          <SvgText
            key={"yAxisLabel" + i}
            x={margin + 10}
            y={yScale(tick)}
            fontSize={12}
            textAnchor="middle"
            fontFamily="Rounded-Regular"
            fill={labelsColor}
          >
            {yAxisLabelsPrefix + tick}
          </SvgText>
        ))}

        <Path
          d={lineGenerator(data) || ""}
          stroke={strokeColors[0] || "#FF2883"}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {data.map((y, i) => (
          <Circle
            key={i}
            cx={xScale(i)}
            cy={yScale(y)}
            r={4}
            fill={dotFill}
            stroke={strokeColors[0] || "#FF2883"}
            strokeWidth={2}
          />
        ))}

        {data2.length > 0 && (
          <Path
            d={lineGenerator(data2) || ""}
            stroke={strokeColors[1] || "#FF2883"}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}

        {data2.length > 0 &&
          data2.map((y, i) => (
            <Circle
              key={i}
              cx={xScale(i)}
              cy={yScale(y)}
              r={4}
              fill={dotFill}
              stroke={strokeColors[1] || "#FF2883"}
              strokeWidth={2}
            />
          ))}

        {xAxisLabels.map((label, i) => (
          <SvgText
            key={"xAxisLabel" + i}
            x={xScale(i)}
            y={height - margin + 25}
            fontSize={12}
            fill={labelsColor}
            textAnchor="middle"
            fontFamily="Rounded-Regular" // Cambia la fuente si lo necesitas
          >
            {label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};
