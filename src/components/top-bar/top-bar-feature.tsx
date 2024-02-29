import { Pressable, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { WalletButton } from "./top-bar-ui";

export function TopBar() {
  return (
    <Appbar.Header mode="small">
      <Appbar.Content title="Solana Expo Template" />
      <WalletButton />
      <Appbar.Action icon="cog-outline" onPress={() => {}} />
    </Appbar.Header>
  );
}
