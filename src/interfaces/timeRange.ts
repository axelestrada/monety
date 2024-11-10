export default interface ITimeRange {
  from: number;
  to: number;
  interval: "day" | "week" | "month" | "year" | "all time" | "custom";
}
