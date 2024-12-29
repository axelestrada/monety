import React from "react";
import {
  View,
  Modal as RawModal,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

interface Props extends ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children, ...props }: Props) {
  const { onRequestClose } = props;

  return (
    <RawModal
      animationType="slide"
      transparent
      statusBarTranslucent
      presentationStyle="overFullScreen"
      {...props}
    >
      <TouchableOpacity
        className="flex-[1] pt-24 justify-end bg-[#00000080]"
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </TouchableOpacity>
    </RawModal>
  );
}
