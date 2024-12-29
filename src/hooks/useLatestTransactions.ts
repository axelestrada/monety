import { useCallback, useState } from "react";

import ITransaction from "@/interfaces/transaction";
import { sleep } from "@/utils/sleep";
import { useSQLiteContext } from "expo-sqlite";
import { normalizeTransaction } from "@/normalizers/normalizeTransaction";

export default function useLatestTransactions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [latestTransactions, setLatestTransactions] = useState<ITransaction[]>(
    []
  );

  const db = useSQLiteContext();

  const getLatestTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await db.getAllAsync<any>(
        "SELECT * FROM Transactions ORDER BY date DESC LIMIT 10;"
      );

      setLatestTransactions(
        result.map((transaction) => normalizeTransaction(transaction))
      );
    } catch (error) {
      setError("Error fetching latest transactions: " + error);
    }

    setLoading(false);
  }, []);

  return { error, loading, latestTransactions, getLatestTransactions };
}
