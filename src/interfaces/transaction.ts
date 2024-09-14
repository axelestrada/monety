import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";

export default interface ITransaction {
  id: string;
  categoryName?: string;
  categoryColor?: (typeof colors)[number];
  categoryIcon?: (typeof icons)[number];
  destinationAccountName?: string;
  destinationAccountColor?: (typeof colors)[number];
  destinationAccountIcon?: (typeof icons)[number];
  accountName: string;
  accountId: string;
  createdAt: number;
  date: number;
  amount: number;
  comment: string;
  type: "Income" | "Expense" | "Transfer";
}
