import ITransaction from "@/features/transactions/types/transaction";

export const normalizeTransaction = (transaction: any): ITransaction => {
  return {
    id: transaction.id,
    amount: transaction.amount,
    date: transaction.date,
    createdAt: transaction.created_at,
    comment: transaction.description,
    originId: transaction.origin_id,
    destinationId: transaction.destination_id,
    type: transaction.type,
  };
};
