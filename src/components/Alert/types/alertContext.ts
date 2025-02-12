import { AlertOptions } from "./alertOptions";

export type AlertContextType = {
  show: (options: AlertOptions) => void;
};
