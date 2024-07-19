import { ReactNode } from "react";

import {
  Modal as NativeModal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

function Modal({
  children,
  visible,
  hideModal,
}: {
  children: ReactNode;
  visible?: boolean;
  hideModal?: () => void;
}) {
  return (
    <NativeModal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalBackDrop}
        activeOpacity={1}
        onPressOut={hideModal}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </TouchableOpacity>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  modalBackDrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.6)",
  },
});

export default Modal;
