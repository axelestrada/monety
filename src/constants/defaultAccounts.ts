import IAccount from "@/interfaces/account";

export const defaultAccounts: IAccount[] = [
  {
    id: 1,
    name: "Cash",
    icon: 12,
    color: 12,
    type: "regular",
    currentBalance: 0,
    includeInOverallBalance: 1,
  },
];
