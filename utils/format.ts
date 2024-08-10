export const firstLetterUppercase = (str: string) =>
  str.split("")[0].toUpperCase() + str.slice(1);

export const numberWithCommas = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const numberWithSign = (
  num: number,
  type: "income" | "expense" | "transfer"
): string => {
  const signs = {
    income: "+ ",
    expense: "- ",
    transfer: "",
  };

  return signs[type] + "L" + numberWithCommas(num);
};
