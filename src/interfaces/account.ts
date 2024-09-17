import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";

export default interface IAccount {
  id: string;
  name: string;
  description?: string;
  icon: (typeof icons)[number];
  color: (typeof colors)[number];
  type: "Regular" | "Savings";
  currentBalance: number;
  includeInOverallBalance: number;
}
