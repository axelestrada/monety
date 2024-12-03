export default interface IDateRange {
  from: number;
  to: number;
  interval: "day" | "week" | "month" | "year" | "all time" | "custom";
}
