import Svg, { Path, SvgProps } from "react-native-svg";

export const HomeOutline = (props: SvgProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={22} height={22} {...props}>
      <Path d="M11.03 2.59a1.501 1.501 0 011.94 0l7.5 6.363a1.5 1.5 0 01.53 1.144V19.5a1.5 1.5 0 01-1.5 1.5h-5.75a.75.75 0 01-.75-.75V14h-2v6.25a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5v-9.403c0-.44.194-.859.53-1.144zM12 3.734l-7.5 6.363V19.5h5v-6.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v6.25h5v-9.403z" />
    </Svg>
  );
};
