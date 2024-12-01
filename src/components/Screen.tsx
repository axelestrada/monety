import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
}

export default function Screen({ children }: ScreenProps) {
  return <SafeAreaView className="flex-1 bg-main-background">{children}</SafeAreaView>;
}
