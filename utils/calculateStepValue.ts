export default function calculateStepValue(
  max: number,
  min: number
) {
  const diff = max - min;

  if (diff <= 30 && (min === 0 || min <= 30)) return 10

  return (max) / 3;
}
