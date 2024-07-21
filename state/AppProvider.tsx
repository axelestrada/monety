import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  IState,
  IOverallBalanceAction,
  ISelectedIntervalAction,
  ISettingsAction,
  StateActions,
} from "./interfaces";

import overallBalanceReducer from "./reducers/overallBalanceReducer";
import selectedIntervalReducer from "./reducers/selectedIntervalReducer";
import settingsReducer from "./reducers/settingsReducer";

const APP_STATE_NAME = "APP_STATE";

let initialState = {
  overallBalance: {
    balance: 0,
  },
  selectedInterval: {
    range: undefined,
    allTime: undefined,
    day: undefined,
    week: undefined,
    today: new Date(),
    year: undefined,
    month: undefined,
  },
  settings: {
    formatting: {
      mainCurrency: {
        name: "US Dollar",
        code: "$",
      },
    },
  },
};

const getStoredData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(APP_STATE_NAME);

    if (jsonValue !== null) {
      initialState = JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error(e);
  }
};

getStoredData();

const combinedReducers = (
  { overallBalance, selectedInterval, settings }: IState,
  action: IOverallBalanceAction | ISelectedIntervalAction | ISettingsAction
) => ({
  overallBalance: overallBalanceReducer(overallBalance, action),
  selectedInterval: selectedIntervalReducer(selectedInterval, action),
  settings: settingsReducer(settings, action),
});

const AppContext = createContext<{
  state: IState;
  dispatch: Dispatch<StateActions>;
}>({ state: initialState, dispatch: () => null });

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(state);
        await AsyncStorage.setItem(APP_STATE_NAME, jsonValue);
      } catch (e) {
        console.error(e);
      }
    };

    storeData();
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
export { AppContext, AppProvider };
