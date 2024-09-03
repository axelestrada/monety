import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";

export interface IAccount {
  id: string;
  name: string;
  description?: string;
  icon: (typeof icons)[number];
  color: (typeof colors)[number];
  type: "Regular" | "Savings";
  currentBalance: number;
}
