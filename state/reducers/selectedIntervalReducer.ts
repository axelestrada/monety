import { SELECTED_INTERVAL } from "../actionTypes";
import { ISelectedInterval, StateActions } from "../interfaces";

const selectedIntervalReducer = (
  selectedInterval: ISelectedInterval,
  action: StateActions
) => {
  switch (action.type) {
    case SELECTED_INTERVAL:
      return { ...selectedInterval, ...action.payload };

    default:
      return selectedInterval;
  }
};

export default selectedIntervalReducer;
