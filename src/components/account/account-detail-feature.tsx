import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";
import {
  AccountBalance,
  AccountButtonGroup,
  AccountTokens,
} from "./account-ui";

export function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();

  if (!selectedAccount) {
    return null;
  }
  const theme = useTheme();

  return (
    <>
      <View style={{ marginTop: 24, alignItems: "center" }}>
        <AccountBalance address={selectedAccount.publicKey} />
        <AccountButtonGroup address={selectedAccount.publicKey} />
      </View>
      <View style={{ marginTop: 48 }}>
        <AccountTokens address={selectedAccount.publicKey} />
      </View>
    </>
  );
}
