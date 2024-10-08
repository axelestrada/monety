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
              frontColor: colorScheme === "dark" ? "#FF8092" : "#1B1D1C",
              labelTextStyle: {
                color: colorScheme === "dark" ? "#F5F5F5" : "#1B1D1C",
                fontFamily: "Rounded-Bold",
              },
            }
      )
    );
  }, [colorScheme]);

  return (
    <View
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-2 mx-3"
      style={styles.shadow}
    >
      <View className="flex flex-row justify-between items-center pb-2">
        <View className="flex flex-row items-center">
          <Text className="text-main dark:text-[#F5F5F5] text-base font-[Rounded-Bold] mr-1">
            Analytics
          </Text>

          <Text
            className={`${
              type === "Incomes"
                ? "text-green bg-green-10 dark:text-[#5bbe77] dark:bg-[#5bbe771a]"
                : "text-red bg-red-10 dark:text-[#FF8092] dark:bg-[#FF80921A]"
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

            <View className="bg-yellow dark:bg-[#f2db73] rounded-full w-4 h-4 justify-center items-center">
              <Entypo name="chevron-down" color="#1B1D1C" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="-mx-2">
        <BarChart
          data={chartData}
          frontColor={colorScheme === "dark" ? "#f2db73" : "#FFE56E"}
          barBorderRadius={100}
          barWidth={16}
          hideRules
          adjustToWidth
          xAxisLabelTextStyle={{
            color: colorScheme === "dark" ? "#F5F5F580" : "#939496",
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
