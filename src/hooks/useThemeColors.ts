import themeColors from "@/constants/themeColors";

import { useColorScheme } from "nativewind";

export default function useThemeColors() {
  const { colorScheme } = useColorScheme();

  return themeColors[colorScheme || "light"];
}
