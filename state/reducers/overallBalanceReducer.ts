import { OVERALL_BALANCE } from "../actionTypes";
import { IOverallBalance, StateActions } from "../interfaces";

const overallBalanceReducer = (
  overallBalance: IOverallBalance,
  action: StateActions
) => {
  switch (action.type) {
    case OVERALL_BALANCE:
      return { ...overallBalance, ...action.payload };

    default:
      return overallBalance;
  }
};

export default overallBalanceReducer;
