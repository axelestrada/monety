import Screen from "@/components/Screen";
import { useTypedSelector } from "@/store";
import { Text, View } from "react-native";

export default function Accounts() {
  const { accounts } = useTypedSelector((state) => state.accounts);

  return (
    <Screen>
      <Text className="text-center mb-3 text-xl">Accounts</Text>

      {accounts.map((account) => (
        <View key={"Account" + account.id} className="m-3">
          <Text className="text-text-primary">Id: {account.id}</Text>
          <Text className="text-text-primary">Name: {account.name}</Text>
          <Text className="text-text-primary">
            CurrentBalance: {account.currentBalance}
          </Text>
          <Text className="text-text-primary">
            Description: {account.description}
          </Text>
          <Text className="text-text-primary">Color: {account.color}</Text>
          <Text className="text-text-primary">Type: {account.type}</Text>
        </View>
      ))}
    </Screen>
  );
}
