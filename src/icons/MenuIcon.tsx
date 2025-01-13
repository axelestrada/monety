import Svg, { Path, SvgProps } from "react-native-svg"

export const MenuIcon = (props: SvgProps) => {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M10 6h10M4 12h16M7 12h13M4 18h10" />
    </Svg>
  );
};
