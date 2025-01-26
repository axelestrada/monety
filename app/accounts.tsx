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
          <Text>Id: {account.id}</Text>
          <Text>Name: {account.name}</Text>
          <Text>CurrentBalance: {account.currentBalance}</Text>
          <Text>Description: {account.description}</Text>
          <Text>Color: {account.color}</Text>
          <Text>Type: {account.type}</Text>
        </View>
      ))}
    </Screen>
  );
}
