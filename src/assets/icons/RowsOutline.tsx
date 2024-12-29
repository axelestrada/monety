import React from "react";
import Svg, { Rect, SvgProps } from "react-native-svg";

export const RowsOutline = (props: SvgProps) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill={props.fill}>
      <Rect
        width={19}
        height={8}
        x={0.5}
        y={0.5}
        stroke={props.stroke}
        strokeWidth={1.5}
        rx={1.5}
      />
      <Rect
        width={19}
        height={8}
        x={0.5}
        y={11.5}
        stroke={props.stroke}
        strokeWidth={1.5}
        rx={1.5}
      />
    </Svg>
  );
};
