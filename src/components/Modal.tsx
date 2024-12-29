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
  marginTop?: boolean;
}

export default function Modal({ children, marginTop = true, ...props }: Props) {
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
        className={`flex-[1] bg-modal-background ${
          marginTop ? "pt-24 justify-end" : "justify-center items-center"
        }`}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </TouchableOpacity>
    </RawModal>
  );
}
