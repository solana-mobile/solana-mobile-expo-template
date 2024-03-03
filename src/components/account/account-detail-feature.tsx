import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";
import { AccountBalance, AccountButtonGroup } from "./account-ui";

export function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();

  if (!selectedAccount) {
    return null;
  }
  const theme = useTheme();

  return (
    <>
      <AccountBalance address={selectedAccount.publicKey} />
      <AccountButtonGroup address={selectedAccount.publicKey} />
    </>
  );
}

const styles = StyleSheet.create({
  accountBalance: {
    marginTop: 12,
    // alignItems: "center",
  },
  accountButtonGroup: {
    paddingVertical: 4,
    flexDirection: "row",
  },
});
