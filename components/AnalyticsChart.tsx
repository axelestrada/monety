import { firstLetterUppercase } from "@/utils/format";
import { AntDesign, Entypo } from "@expo/vector-icons";
import moment, { Moment } from "moment";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import Dropdown from "./ui/Dropdown";
import styles from "@/styles/shadow";

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
  type: "incomes" | "expenses";
}

const AnalyticsChart = ({ type }: Props) => {
  const windowWidth = Dimensions.get("window").width;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelectedOption, setDropdownSelectedOption] =
    useState("Today");

  const dropdownOptions = ["Today", "This week", "This month", "This year"];

  return (
    <View className="bg-white rounded-2xl py-4 mx-4" style={styles.shadow}>
      <View className="flex flex-row justify-between items-center px-4 mb-4">
        <View className="flex flex-row items-center">
          <Text className="text-main text-base font-[Rounded-Bold] mr-1">
            Analytics
          </Text>

          <Text
            className={`${
              type === "incomes"
                ? "text-green bg-green-10"
                : "text-red bg-red-10"
            } rounded-md px-2 py-1`}
          >
            {firstLetterUppercase(type)}
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
            className="flex flex-row justify-between items-center p-2 -m-2"
          >
            <Text className="text-main-500 font-[Rounded-Medium] mr-2">
              {dropdownSelectedOption}
            </Text>

            <View className="bg-yellow rounded-full w-4 h-4 justify-center items-center">
              <Entypo name="chevron-down" color="#1B1D1C" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <BarChart
        data={data}
        frontColor="#FFE56E"
        barBorderRadius={100}
        barWidth={16}
        hideRules
        adjustToWidth
        xAxisLabelTextStyle={{
          color: "#939496",
          fontFamily: "Rounded-Regular",
        }}
        hideYAxisText
        hideOrigin
        yAxisThickness={0}
        xAxisThickness={0}
        width={windowWidth - 58}
        spacing={(windowWidth - 16 * 7 - 50) / 7}
        initialSpacing={16}
        endSpacing={4}
        maxValue={1050}
        height={150}
        disableScroll
      />
    </View>
  );
};

export default AnalyticsChart;
