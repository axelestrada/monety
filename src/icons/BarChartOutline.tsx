import Svg, { Path, SvgProps } from "react-native-svg";

export const BarChartOutline = (props: SvgProps) => {
  return (
    <Svg viewBox="0 0 22 22" width={22} height={22} fill={props.fill}>
      <Path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.64 9.625H2.923a.86.86 0 00-.86.86v6.53c0 .475.385.86.86.86H4.64a.86.86 0 00.859-.86v-6.53a.86.86 0 00-.86-.86zm7.22-2.062h-1.72a.86.86 0 00-.859.859v8.594a.86.86 0 00.86.859h1.718a.86.86 0 00.86-.86V8.423a.86.86 0 00-.86-.86zm7.218-2.75H17.36a.86.86 0 00-.859.859v11.344a.86.86 0 00.86.859h1.718a.86.86 0 00.86-.86V5.673a.86.86 0 00-.86-.86z"
      />
    </Svg>
  );
};
