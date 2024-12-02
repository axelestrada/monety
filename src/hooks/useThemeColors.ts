import colors from "@/constants/colors";

import { useColorScheme } from "nativewind";

export default function useThemeColors() {
  const { colorScheme } = useColorScheme();

  return colors[colorScheme || "light"];
}
