import Screen from "@/components/Screen";
import Header from "@/components/Header";

import HeaderAction from "@/components/HeaderAction";

import { useColorScheme } from "nativewind";

export default function HomeScreen() {
  const { toggleColorScheme } = useColorScheme();

  return (
    <Screen>
      <Header overallBalance dateRange>
        <HeaderAction icon="bell" badge />
        <HeaderAction icon="search" onPress={toggleColorScheme} />
      </Header>
    </Screen>
  );
}
