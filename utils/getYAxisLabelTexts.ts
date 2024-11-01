export default function getYAxisLabelTexts(
  max: number,
  min: number,
  stepValue: number
): string[] {
  const diff = max - min;

  const steps: number[] = [
    diff <= 30 && min !== 0 ? min : diff <= 30 && min <= 30 ? 0 : min,
  ];

  for (let i = 1; i <= 3; i++) {
    steps.push(
      i < 3
        ? diff <= 30 && min <= 30 && min !== 0
          ? Math.round(i * (max >= 10 ? max : 10))
          : Math.round(i * stepValue)
        : diff <= 30 && min <= 30 && min !== 0
        ? Math.round(i * (max >= 10 ? max : 10))
        : max <= 30
        ? 30
        : max
    );
  }

  return steps
    .map((val) => {
      if (val <= 10) return val;

      const stringValue = val.toString();

      const lastDigit = parseInt(stringValue.split("")[stringValue.length - 1]);

      if (lastDigit === 0 || lastDigit === 5) return val;

      if (lastDigit < 5) return parseInt(stringValue.replace(/.$/, "0"));

      if (lastDigit > 5)
        return parseInt((val + 10).toString().replace(/.$/, "0"));

      return val;
    })
    .map((val) => "L " + (val > 999 ? val / 1000 + "K" : val));
}
