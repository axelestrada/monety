import { Entypo } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  options: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  hide: () => void;
}

const Dropdown = ({
  options,
  selectedOption,
  hide,
  setSelectedOption,
}: Props) => {
  return (
    <View
      className="absolute top-6 right-0 -left-5 z-50 bg-white rounded-lg py-1"
      style={{ elevation: 8, shadowColor: "#1B1D1C80" }}
    >
      {options
        .filter((opt) => opt !== selectedOption)
        .map((opt) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              hide();
              setSelectedOption(opt);
            }}
            className="w-full py-1 px-2"
          >
            <Text className="text-main-500 font-[Rounded-Medium]">{opt}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default Dropdown;
