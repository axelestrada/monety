export const firstLetterUppercase = (str: string) =>
  str.split("")[0].toUpperCase() + str.slice(1);

export const numberWithCommas = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const numberWithSign = (
  num: number,
  type: "Income" | "Expense" | "Transfer"
): string => {
  const signs = {
    Income: "+ ",
    Expense: "- ",
    Transfer: "",
  };

  return signs[type] + "L " + numberWithCommas(num);
};
