import IAccount from "@/features/accounts/types/account";

export const normalizeAccount = (account: any): IAccount => {
  return {
    id: account.id,
    name: account.name,
    description: account.description,
    icon: account.icon,
    color: account.color,
    type: account.type,
    currentBalance: account.current_balance,
    includeInOverallBalance: account.include_in_totals,
    goal: account.goal,
  };
};
