import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";

export default interface ICategory {
  id: string;
  name: string;
  icon: typeof icons[number];
  color: typeof colors[number];
  type: "Income" | "Expense";
}
