import { firstLetterUppercase } from "@/utils/format";
import { AntDesign, Entypo } from "@expo/vector-icons";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import Dropdown from "./ui/Dropdown";
import { styles } from "@/styles/shadow";
import { useColorScheme } from "nativewind";

// TODO: Replace data with real information

const data: barDataItem[] = [
  { value: 500, label: "Sun" },
  { value: 700, label: "Mon" },
  { value: 400, label: "Tue" },
  {
    value: 850,
    label: "Wed",
    frontColor: "#1B1D1C",
    labelTextStyle: { color: "#1B1D1C", fontFamily: "Rounded-Bold" },
    topLabelComponent: () => (
      <Text style={{ color: "#FFFFFF", fontFamily: "Rounded-Bold" }}>
        L1,525
      </Text>
    ),
    topLabelContainerStyle: {
      width: 6 * 9,
      height: 30,
      borderRadius: 10,
      position: "absolute",
      top: -35,
      left: "50%",
      backgroundColor: "#1B1D1C",
      justifyContent: "center",
      alignItems: "center",
      transform: [
        {
          translateX: -(6 * 9) / 2,
        },
      ],
    },
  },
  { value: 300, label: "Thu" },
  { value: 450, label: "Fri" },
  { value: 300, label: "Sat" },
];

interface Props {
  type: "Incomes" | "Expenses";
}

const AnalyticsChart = ({ type }: Props) => {
  const windowWidth = Dimensions.get("window").width;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelectedOption, setDropdownSelectedOption] = useState("Today");

  const { colorScheme } = useColorScheme();

  const [chartData, setChartData] = useState<barDataItem[]>(data);

  const dropdownOptions = ["Today", "This week", "This month", "This year"];

  useEffect(() => {
    setChartData((data) =>
      data.map((item) =>
        item.value !== 850
          ? item
          : {
              ...item,
              frontColor: colorScheme === "dark" ? "#E95A5C" : "#1B1D1C",
              labelTextStyle: {
                color: colorScheme === "dark" ? "#FFFFFF" : "#1B1D1C",
                fontFamily: "Rounded-Bold",
              },
              topLabelComponent: () => (
                <Text
                  style={{
                    color: colorScheme === "dark" ? "#1B1D1C" : "#ffffff",
                    fontFamily: "Rounded-Bold",
                  }}
                >
                  L1,525
                </Text>
              ),
              topLabelContainerStyle: {
                ...item.topLabelContainerStyle,
                backgroundColor: colorScheme === "dark" ? "#FFFFFF" : "#1B1D1C",
              }
            }
      )
    );
  }, [colorScheme]);

  return (
    <View
      className="bg-white dark:bg-[#131416] rounded-2xl p-2 mx-3"
      style={styles.shadow}
    >
      <View className="flex flex-row justify-between items-center pb-2">
        <View className="flex flex-row items-center">
          <Text className="text-main dark:text-white text-base font-[Rounded-Bold] mr-1">
            Analytics
          </Text>

          <Text
            className={`${
              type === "Incomes"
                ? "text-green bg-green-10 dark:text-[#4EC871] dark:bg-[#4EC8711A]"
                : "text-red bg-red-10 dark:text-[#E95A5C] dark:bg-[#E95A5C1A]"
            } rounded-md px-1.5 py-1 text-sm`}
          >
            {type}
          </Text>
        </View>

        <View className="relative">
          {dropdownOpen && (
            <Dropdown
              options={dropdownOptions}
              hide={() => setDropdownOpen(false)}
              selectedOption={dropdownSelectedOption}
              setSelectedOption={setDropdownSelectedOption}
            />
          )}

          <TouchableOpacity
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.5}
            className="flex flex-row justify-between items-center pr-2 -m-2"
          >
            <Text className="text-main-500 dark:text-[#FFFFFF80] font-[Rounded-Medium] mr-1 text-sm">
              {dropdownSelectedOption}
            </Text>

            <View className="bg-yellow dark:bg-[#FAE16C] rounded-full w-4 h-4 justify-center items-center">
              <Entypo name="chevron-down" color="#1B1D1C" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="-mx-2">
        <BarChart
          data={chartData}
          frontColor={colorScheme === "dark" ? "#FAE16C" : "#FFE56E"}
          barBorderRadius={100}
          barWidth={16}
          hideRules
          adjustToWidth
          xAxisLabelTextStyle={{
            color: colorScheme === "dark" ? "#FFFFFF80" : "#939496",
            fontFamily: "Rounded-Regular",
            fontSize: 14,
          }}
          hideYAxisText
          hideOrigin
          yAxisThickness={0}
          xAxisThickness={0}
          width={windowWidth - 40}
          spacing={(windowWidth - 16 * 7 - 10) / 7}
          initialSpacing={8}
          endSpacing={4}
          maxValue={1050}
          height={150}
          disableScroll
        />
      </View>
    </View>
  );
};

export default AnalyticsChart;
