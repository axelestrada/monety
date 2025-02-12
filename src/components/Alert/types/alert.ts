import { AlertOptions } from "./alertOptions";

export type AlertProps = {
  alertOptions: AlertOptions;
  onRequestClose: () => void;
};
