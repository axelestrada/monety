import useLoadFonts from "@/hooks/useLoadFonts";

import HomeScreen from "@/screens/HomeScreen";

export default function Index() {
  const [error, loaded] = useLoadFonts();

  if(!loaded && !error) return null;

  return <HomeScreen />;
}
