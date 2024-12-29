import { useTypedSelector } from "@/store";

export default function calculateOverallBalance(): number {
  const { accounts } = useTypedSelector((state) => state.accounts);

  return accounts.reduce(
    (acc, account) =>
      account.includeInOverallBalance ? acc + account.currentBalance : acc,
    0
  );
}
