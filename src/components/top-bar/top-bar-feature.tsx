import { Pressable, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { TopBarWalletButton } from "./top-bar-ui";

export function TopBar() {
  return (
    <Appbar.Header mode="medium">
      <Appbar.Content title="Solana Expo Template" />
      {/* <Appbar.Action icon="wallet" onPress={() => {}} /> */}
      <Appbar.Action
        icon="cog-outline"
        mode="contained-tonal"
        onPress={() => {}}
      />
      <TopBarWalletButton />
    </Appbar.Header>
  );
}
