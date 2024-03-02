import { Button, IconButton, useTheme } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

function truncateAddress(address: string): string {
  return `${address.slice(0, 3)}...${address.slice(
    address.length - 3,
    address.length
  )}`;
}

export function TopBarWalletButton() {
  const { selectedAccount } = useAuthorization();
  const { connect, disconnect } = useMobileWallet();
  return (
    <Button
      icon="wallet"
      mode="contained-tonal"
      style={styles.button}
      onPress={selectedAccount ? disconnect : connect}
    >
      {selectedAccount
        ? truncateAddress(selectedAccount.publicKey.toBase58())
        : "Connect"}
    </Button>
  );
}

export function TopBarSettingsButton() {
  const navigation = useNavigation();
  return (
    <IconButton
      icon="cog"
      mode="contained-tonal"
      onPress={() => {
        navigation.navigate("Settings");
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
  },
});
