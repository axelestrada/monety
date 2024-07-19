import Svg, { Path, SvgProps } from "react-native-svg";

function CalendarToday({ width = 128, height = 128, fill = "#000" }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 128 128" fill="none">
      <Path
        d="M71.521 62.364V106h-9.226V71.12h-.255l-9.993 6.265v-8.182l10.802-6.84h8.672z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.524 15.914a2.768 2.768 0 00-2.767-2.768H5.535A5.535 5.535 0 000 18.68v103.784A5.535 5.535 0 005.535 128h116.93a5.535 5.535 0 005.535-5.535V18.681a5.535 5.535 0 00-5.535-5.535h-16.606a2.767 2.767 0 00-2.767 2.768v1.383a2.767 2.767 0 002.767 2.768h14.53v19.373H6.919V19.373h13.838a2.768 2.768 0 002.767-2.768v-.691zM6.92 120.388v-73.34h113.47v73.34H6.919z"
        fill={fill}
      />
      <Path
        d="M30.443 25.6V6.227a6.227 6.227 0 0112.454 0V25.6a6.227 6.227 0 11-12.454 0zM74.724 19.373H51.892a3.46 3.46 0 010-6.919h22.832a3.46 3.46 0 110 6.919zM84.41 27.293V6.536a6.227 6.227 0 1112.455 0v20.757a6.227 6.227 0 01-12.454 0z"
        fill={fill}
      />
    </Svg>
  );
}

export default CalendarToday;
