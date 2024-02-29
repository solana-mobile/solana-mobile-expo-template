import { Button } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";

function truncateAddress(address: string): string {
  return `${address.slice(0, 3)}...${address.slice(
    address.length - 3,
    address.length
  )}`;
}

export function WalletButton() {
  const { selectedAccount } = useAuthorization();
  const { connect, disconnect } = useMobileWallet();
  return (
    <Button
      icon="wallet"
      mode="contained"
      onPress={selectedAccount ? disconnect : connect}
    >
      {selectedAccount
        ? truncateAddress(selectedAccount.publicKey.toBase58())
        : "Connect"}
    </Button>
  );
}
