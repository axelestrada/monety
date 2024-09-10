import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";

const TimeRange = () => {
  return (
    <View className="mb-2 justify-between items-center flex flex-row w-full">
      <IconButton>
        <Feather name="chevron-left" color="#1B1D1C" size={22} />
      </IconButton>

      <Text className="text-main text-base font-[Rounded-Medium]">
        August 11 2024
      </Text>

      <IconButton>
        <Feather name="chevron-right" color="#1B1D1C" size={22} />
      </IconButton>
    </View>
  );
};

export default TimeRange;
