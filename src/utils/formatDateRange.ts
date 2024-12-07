import IDateRange from "@/interfaces/dateRange";

import moment from "moment";

export const formatDateRange = ({ from, to, interval }: IDateRange): string => {
  console.log(`${from} - ${to}`);

  if (interval === "day") {
    return moment(from * 1000).format("MMMM DD YYYY");
  }

  if (interval === "week" || interval === "custom") {
    if (!moment(from * 1000).isSame(moment(to * 1000), "year")) {
      return `${moment(from * 1000).format("MMM DD YYYY")} - ${moment(
        to * 1000
      ).format("MMM DD YYYY")}`;
    }

    if (!moment(from * 1000).isSame(moment(to * 1000), "month")) {
      return `${moment(from * 1000).format("MMM DD")} - ${moment(
        to * 1000
      ).format("MMM DD YYYY")}`;
    }

    if (moment(from * 1000).isSame(moment(to * 1000), "day")) {
      return moment(from * 1000).format("MMMM DD YYYY");
    }

    return `${moment(from * 1000).format("MMM DD")} - ${moment(
      to * 1000
    ).format("DD YYYY")}`;
  }

  if (interval === "month") {
    if (!moment(from * 1000).isSame(moment(), "year")) {
      return `${moment(from * 1000).format("MMMM YYYY")}`;
    }

    return `${moment(from * 1000).format("MMMM")}`;
  }

  if (interval === "year") {
    return `${moment(from * 1000).format("YYYY")}`;
  }

  return "All time";
};
