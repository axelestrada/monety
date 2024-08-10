export interface TransactionInterface {
  id: string;
  category: {
    name: string;
    color: string;
    icon: string;
  };
  account: {
    name: string;
    color: string;
    icon: string;
  };
  amount: number;
  type: "income" | "expense" | "transfer";
  createdAt: Date;
  date: Date;
}
