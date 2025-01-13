export default interface IAccount {
  id: number;
  name: string;
  description?: string;
  icon: number;
  color:number;
  type: "regular" | "savings";
  currentBalance: number;
  includeInOverallBalance: number;
  goal?: number;
}
