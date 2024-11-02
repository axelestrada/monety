export default function formatCurrency(value: number): string {
  let formattedNumber = Intl.NumberFormat("en-US").format(value);

  const isNegative = value < 0;
  const decimals = formattedNumber.split(".")[1];

  if (decimals?.length === 1) formattedNumber += "0";

  if (isNegative) return `-L ${formattedNumber.slice(1)}`;

  return `L ${formattedNumber}`;
}
