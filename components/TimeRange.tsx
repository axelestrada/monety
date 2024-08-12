import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import IconButton from "./ui/IconButton";

const TimeRange = () => {
  return (
    <View className="px-4 justify-between items-center flex flex-row w-full">
      <IconButton>
        <Feather name="chevron-left" color="#1B1D1C" size={18} />
      </IconButton>

      <Text className="text-main text-sm font-[Rounded-Medium]">
        August 11 2024
      </Text>

      <IconButton>
        <Feather name="chevron-right" color="#1B1D1C" size={18} />
      </IconButton>
    </View>
  );
};

export default TimeRange;
