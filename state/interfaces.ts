import { OVERALL_BALANCE, SELECTED_INTERVAL, SETTINGS } from "./actionTypes";

//#region Overall Balance

export interface IOverallBalance {
  balance: number;
}

export interface IOverallBalanceAction {
  type: typeof OVERALL_BALANCE;
  payload: IOverallBalance;
}

//#endregion


//#region Selected Interval

export interface ISelectedInterval {
  range?: {
    startDate: Date;
    endDate: Date;
  };
  allTime?: boolean;
  day?: Date;
  week?: {
    startDate: Date;
    endDate: Date;
  };
  today?: Date;
  year?: number;
  month?: {
    month: number;
    year: number;
  };
}

export interface ISelectedIntervalAction {
  type: typeof SELECTED_INTERVAL;
  payload: ISelectedInterval;
}

//#endregion


//#region Settings

export interface ISettings {
  formatting: {
    mainCurrency: {
      name: string;
      code: string;
    }
  }
}

export interface ISettingsAction {
  type: typeof SETTINGS;
  payload: ISettings;
}

//#endregion

export interface IState {
  overallBalance: IOverallBalance;
  selectedInterval: ISelectedInterval;
  settings: ISettings;
}

export type StateActions = IOverallBalanceAction | ISelectedIntervalAction | ISettingsAction