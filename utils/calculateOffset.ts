export default function calculateOffset(max: number, min: number) {
  let diff = max - min;

  if (diff <= 30 && (min === 0 || min <= 30)) return 3;

  return Math.round((max * 10) / 100);
}
