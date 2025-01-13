export const getYAxisLabelTexts = (
  min: number,
  max: number,
  steps: number,
  offset: number = 0,
): string[] => {
  const step = (max - offset) / steps;

  const labels: string[] = [];

  let currentValue = offset ? min : 0;

  for (let i = 0; i <= steps; i++) {
    const roundedValue = Math.round(currentValue / 10) * 10;

    const suffix = roundedValue > 999 ? "K" : "";
    labels.push(
      `L ${suffix ? ((roundedValue / 1000) % 1 === 0 ? roundedValue/1000 : (roundedValue/1000).toFixed(1)) : roundedValue}${suffix}`,
    );

    currentValue += step;
  }

  return labels;
};
