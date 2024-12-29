export default function formatCurrency(
  value: number,
  options: {
    showSign?: "always" | "only-positive" | "only-negative";
    spacing?: boolean;
  } = {
    showSign: "only-negative",
    spacing: false,
  }
): string {
  let formattedNumber = Intl.NumberFormat("en-US").format(value);

  const isNegative = value < 0;
  const decimals = formattedNumber.split(".")[1];

  const { showSign = "only-negative", spacing = false } = options;

  let sign = isNegative ? "-" : "+";

  if (isNegative) {
    formattedNumber = formattedNumber.slice(1);
  }

  if (decimals?.length === 1) formattedNumber += "0";

  if (showSign === "always")
    return `${sign}L${spacing ? " " : ""}${formattedNumber}`;

  if (showSign === "only-negative" && isNegative)
    return `${sign}L${spacing ? " " : ""}${formattedNumber}`;

  if (showSign === "only-positive" && !isNegative)
    return `${sign}L${spacing ? " " : ""}${formattedNumber}`;

  return `L${spacing ? " " : ""}${formattedNumber}`;
}
