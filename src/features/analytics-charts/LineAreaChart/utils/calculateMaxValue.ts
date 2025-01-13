export const calculateMaxValue = (min: number, max: number): number => {
  const roundedMax = Math.ceil(max / 10) * 10;
  const roundedMin = Math.floor(min / 10) * 10;

  const diff = roundedMax - roundedMin;

  return diff >= 30 ? roundedMax : roundedMax + (30 - diff);
};
