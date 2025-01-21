import { CustomText } from "@/components/CustomText";

interface AnimatedDigitTickProps {
  digit: string;
}

export const AnimatedDigitTick = ({ digit }: AnimatedDigitTickProps) => {
  const fontSize = 30;
  const digitHeight = fontSize * 1.5;

  return (
    <CustomText
      className="font-[Rounded-Bold] text-text-primary"
      style={{
        fontSize: fontSize,
        lineHeight: digitHeight,
        fontVariant: ["tabular-nums"],
        height: digitHeight,
      }}
    >
      {digit}
    </CustomText>
  );
};
