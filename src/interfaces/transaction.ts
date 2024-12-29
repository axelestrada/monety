export default interface ITransaction {
  id: number;
  date: number;
  createdAt: number;
  amount: number;
  comment?: string;
  originId: number;
  destinationId: number;
  type: "transfer" | "expense" | "income";
}
