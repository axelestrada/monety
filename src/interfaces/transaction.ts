export default interface ITransaction {
  id: string;
  icon: {
    id: number;
    color: number;
  };
  originId: number;
  destinationId: number;
  date: number;
  createdAt: number;
  amount: number;
  comment?: string;
  type: "transfer" | "expense" | "income";
}
