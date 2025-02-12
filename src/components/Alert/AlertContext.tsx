import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { AlertOptions } from "./types/alertOptions";
import { AlertContextType } from "./types/alertContext";

import Modal from "../Modal";
import { View } from "react-native";
import { Alert } from "./Alert";
import { CustomModal } from "../CustomModal";

export const AlertContext = createContext<AlertContextType>({
  show: () => {
    throw new Error("show not implemented");
  },
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    title: "Alert",
    buttons: []
  });

  const show = useCallback((options: AlertOptions) => {
    setIsAlertVisible(true);
    setAlertOptions(options);
  }, []);

  const close = useCallback(() => {
    setIsAlertVisible(false);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        show,
      }}
    >
      {children}

      <CustomModal isVisible={isAlertVisible} onRequestClose={() => close()}>
        <Alert alertOptions={alertOptions} onRequestClose={() => close()} />
      </CustomModal>
    </AlertContext.Provider>
  );
};
