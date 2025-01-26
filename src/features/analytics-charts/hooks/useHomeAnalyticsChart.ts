import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useTypedSelector } from "@/store";
import { sleep } from "@/utils/sleep";
import moment from "moment";

const useHomeAnalyticsChart = () => {
  const [transactionsSummary, setTransactionsSummary] = useState<
    TransactionChart[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = useSQLiteContext();

  const { dateRange } = useTypedSelector((state) => state.userPreferences);

  const getTransactionsSummaryByHour = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedResult: TransactionChart[] = [];

      await Promise.all([
        db
          .getAllAsync<{
            datetime: string;
            type: "income" | "expense";
            total_amount: number;
          }>(
            `
        SELECT
          strftime('%Y-%m-%d %H:00:00', date, 'unixepoch', 'localtime') AS datetime,
          type,
          SUM(amount) AS total_amount
        FROM Transactions
        WHERE type IN ('income', 'expense') AND (date >= ? AND date <= ?)
        GROUP BY datetime, type
        ORDER BY datetime ASC;`,
            [dateRange.from, dateRange.to]
          )
          .then((result) => {
            result.forEach((row) => {
              const existingEntry = formattedResult.find(
                (entry) => entry.datetime === row.datetime
              );

              if (existingEntry) {
                existingEntry[row.type] = Math.round(row.total_amount);
              } else {
                formattedResult.push({
                  datetime: row.datetime,
                  income:
                    row.type === "income" ? Math.round(row.total_amount) : 0,
                  expense:
                    row.type === "expense" ? Math.round(row.total_amount) : 0,
                });
              }
            });
          }),
        sleep(300),
      ]);

      setTransactionsSummary(
        formattedResult.length === 1
          ? [
              ...formattedResult,
              {
                datetime: moment(formattedResult[0].datetime)
                  .add(1, "hour")
                  .format(),
                income: 0,
                expense: 0,
              },
            ]
          : formattedResult
      );
    } catch (error) {
      setError("Error fetching transactions summary by hour");
    }

    setLoading(false);
  }, [dateRange]);

  return {
    transactionsSummary,
    loading,
    error,
    getTransactionsSummaryByHour,
  };
};

export default useHomeAnalyticsChart;
